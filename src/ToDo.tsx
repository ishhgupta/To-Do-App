import React, { useState, useRef } from "react";
import type { ProColumns } from "@ant-design/pro-table";
import type { ActionType } from "@ant-design/pro-table";
import { EditableProTable } from "@ant-design/pro-table";
import ProField from "@ant-design/pro-field";
import { ProFormRadio } from "@ant-design/pro-form";
import { Popconfirm, Button, Input, Space, Tag, Form } from "antd";
import ProCard from "@ant-design/pro-card";
import { PlusOutlined } from "@ant-design/icons";

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const TagList: React.FC<{
  value?: {
    key: string;
    label: string;
  }[];
  onChange?: (
    value: {
      key: string;
      label: string;
    }[]
  ) => void;
}> = ({ value, onChange }) => {
  const ref = useRef<Input | null>(null);
  const [newTags, setNewTags] = useState<
    {
      key: string;
      label: string;
    }[]
  >([]);
  const [inputValue, setInputValue] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    let tempsTags = [...(value || [])];
    if (
      inputValue &&
      tempsTags.filter((tag) => tag.label === inputValue).length === 0
    ) {
      tempsTags = [
        ...tempsTags,
        { key: ` new- $ { tempsTags . length } `, label: inputValue },
      ];
    }
    onChange?.(tempsTags);
    setNewTags([]);
    setInputValue("");
  };

  return (
    <Space>
      {(value || []).concat(newTags).map((item) => (
        <Tag key={item.key}>{item.label}</Tag>
      ))}
      <Input
        ref={ref}
        type="text"
        size="small"
        style={{ width: 78 }}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputConfirm}
        onPressEnter={handleInputConfirm}
      />
    </Space>
  );
};

type DataSourceType = {
  id: React.Key;
  title?: string;
  decs?: string;
  dueDate?: string;
  labels?: {
    key: string;
    label: string;
  }[];
  state?: string;
  created_at?: string;
  children?: DataSourceType[];
};

const defaultData: DataSourceType[] = [
  {
    id: 624748504,
    title: "Activity name one",
    decs: "This activity is really fun",
    dueDate: "2021-06-30T09:42:56Z",
    labels: [{ key: "man", label: "Northwestern Man" }],
    state: "overdue",
    created_at: "2020-05-28T09:42:56Z",
  },
  {
    id: 624748526,
    title: "Activity name three",
    decs: "This activity is really fun",
    dueDate: "2020-05-30T09:42:56Z",
    labels: [{ key: "man", label: "Northwestern Man" }],
    state: "overdue",
    created_at: "2020-05-29T09:42:56Z",
  },
  {
    id: 624691229,
    title: "Acitivty name two",
    decs: "This acitvity is great",
    dueDate: "2020-05-28T09:42:56Z",
    labels: [{ key: "man", label: "Northwestern Man" }],
    state: "done",
    created_at: "2020-05-27T08:19:22Z",
  },
  {
    id: 624691230,
    title: "Acitivty name four",
    decs: "heya acitvity is great",
    dueDate: "2021-05-28T09:42:56Z",
    labels: [{ key: "man", label: "Northwestern Man" }],
    state: "done",
    created_at: "2020-05-27T08:19:22Z",
  },
];

function Todo() {
  const actionRef = useRef<ActionType>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<DataSourceType[]>([]);
  const [form] = Form.useForm();
  const [position, setPosition] = useState<"top" | "bottom" | "hidden">(
    "bottom"
  );

  const columns: ProColumns<DataSourceType>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: "5%",
    },
    {
      title: "TimeStamp Created",
      dataIndex: "created_at",
      valueType: "date",
      sorter: true,
      width: "10%",
      editable: false,
    },
    {
      title: "Title",
      dataIndex: "title",
      //   sorter: {
      //   compare: (a, b) => a.title.length - b.title.length,
      //   multiple: 3,
      // },
      // sorter: (a, b) => a.title.length - b.title.length,
      // sortDirections: ['descend'],
      //   sorter : true,
      //   order : 2,
      // defaultSortOrder: 'ascend',
      formItemProps: {
        rules: [
          {
            required: true,
            message: "This item is required",
          },
          {
            max: 100,
            whitespace: true,
            message: "The longest is 100 characters",
          },
        ],
      },
      width: "15%",
    },
    {
      title: "Description",
      dataIndex: "decs",
      width: "20%",
      // sorter : (a, b) => a.decs.length - b.decs.length,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "This item is required",
          },
          {
            max: 1000,
            whitespace: true,
            message: "The longest is 1000 characters",
          },
        ],
      },
      fieldProps: (from, { rowKey, rowIndex }) => {
        if (from.getFieldValue([rowKey || "", "title"]) === "不好玩") {
          return {
            disabled: true,
          };
        }
        if (rowIndex > 9) {
          return {
            disabled: true,
          };
        }
        return {};
      },
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      sorter: true,
      valueType: "date",
      width: "10%",
    },
    {
      title: "Tag",
      dataIndex: "labels",
      width: "15%",
      filters: true,
      onFilter: true,
      renderFormItem: (_, { isEditable }) => {
        return isEditable ? <TagList /> : <Input />;
      },
      render: (_, row) =>
        row?.labels?.map((item) => <Tag key={item.key}>{item.label}</Tag>),
    },
    {
      title: "Status",
      key: "state",
      dataIndex: "state",
      valueType: "select",
      initialValue: "open",
      filters: true,
      onFilter: true,
      width: "10%",
      valueEnum: {
        // all: { text: "OPEN", status: "Default" },
        open: {
          text: "OPEN",
          status: "default",
        },
        working: {
          text: "WORKING",
          status: "Processing",
        },
        overdue: {
          text: "OVERDUE",
          status: "Error",
        },
        done: {
          text: "DONE",
          status: "Success",
        },
      },
    },

    {
      title: "Operation",
      valueType: "option",
      width: "15%",
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          <Button type="link" size="small">
            MODIFY
          </Button>
        </a>,
        <Popconfirm
          title="Are you Sure?"
          key="delete"
          onConfirm={() => {
            setDataSource(dataSource.filter((item) => item.id !== record.id));
          }}
        >
          <Button type="link" size="small">
            DELETE
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <>
      <EditableProTable<DataSourceType>
        actionRef={actionRef}
        rowKey="id"
        headerTitle="TO DO LIST"
        search={{
          layout: "vertical",
          labelWidth: "auto",
        }}
        maxLength={10}
        recordCreatorProps={false}
        toolBarRender={() => [
          <Space>
            <Button
              type="primary"
              onClick={() => {
                actionRef.current?.addEditRecord?.({
                  id: (Math.random() * 1000000).toFixed(0),
                  created_at: new Date(),
                  state: "open",
                });
              }}
              icon={<PlusOutlined />}
            >
              New line
            </Button>
            <Button
              key="reset"
              onClick={() => {
                form.resetFields();
              }}
            >
              Reset form
            </Button>
          </Space>,
        ]}
        columns={columns}
        request={async (params = {}, sorter, filter) => {
          // The form search item will be passed in from params and passed to the back-end interface.
          console.log(params, sorter, filter);
          return Promise.resolve({
            data: defaultData,
            success: true,
          });
        }}
        pagination={{
          pageSize: 10,
        }}
        value={dataSource}
        onChange={setDataSource}
        editable={{
          type: "multiple",
          editableKeys,
          onSave: async () => {
            await waitTime(2000);
          },
          onChange: setEditableRowKeys,
        }}
        dateFormatter="string"
      />

      <ProCard title="Table data" headerBordered collapsible defaultCollapsed>
        <ProField
          fieldProps={{
            style: {
              width: "100%",
            },
          }}
          mode="read"
          valueType="jsonCode"
          text={JSON.stringify(dataSource)}
        />
      </ProCard>
    </>
  );
}

export default Todo;
