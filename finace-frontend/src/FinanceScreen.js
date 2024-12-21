import "./App.css";
import TransactionList from "./components/TransactionList";
import AddItem from "./components/AddItem";
import EditItem from "./components/EditItem";
import { Divider, Layout, Typography, Spin, message } from "antd";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import axios from "axios";

const { Sider, Content } = Layout;

const URL_TXACTIONS = "/api/txactions";
const URL_USER = "/api/user/me";

function FinanceScreen() {
  const [summaryAmount, setSummaryAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [transactionData, setTransactionData] = useState([]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditRecord, setCurrentEditRecord] = useState(null);

  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  const navigate = useNavigate();

  const getUserData = async () => {
    try {
      const response = await axios.get(URL_USER, {
        headers: { Authorization: `Bearer ${token}`
        },
      });
      setUser(response.data);
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  }

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(URL_TXACTIONS);
      setTransactionData(
        response.data.data.map((row) => ({
          id: row.id,
          key: row.id,
          ...row.attributes,
        })),
      );
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    message.info("You have been logged out.");
    console.log("User logged out.");
    navigate("/login");
  };

  const handleAddItem = async (item) => {
    try {
      setIsLoading(true);
      const params = { ...item, action_datetime: dayjs() };
      const response = await axios.post(URL_TXACTIONS, { data: params });
      const { id, attributes } = response.data.data;
      setTransactionData([
        ...transactionData,
        { id: id, key: id, ...attributes },
      ]);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNoteChanged = (id, note) => {
    setTransactionData(
      transactionData.map((transaction) => {
        transaction.note = transaction.id === id ? note : transaction.note;
        return transaction;
      }),
    );
  };

  const updateItem = async (item) => {
    try {
      setIsLoading(true);
      await axios.put(`${URL_TXACTIONS}/${item.id}`, { data: item });
      fetchItems();
    } catch (err) {
      console.log("Error updating item:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowEdit = (record) => {
    setCurrentEditRecord(record);
    setIsEditModalOpen(true);
  };

  const handleRowEdited = async (updatedItem) => {
    await updateItem(updatedItem);
  };

  const handleRowDeleted = async (id) => {
    try {
      setIsLoading(true);
      await axios.delete(`${URL_TXACTIONS}/${id}`);
      fetchItems();
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   if (token) {
  //     getUserData();
  //   } else {
  //     message.error("You need to login to access this page.")
  //   }
  // }, [token]);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    setSummaryAmount(
      transactionData.reduce(
        (sum, transaction) =>
          transaction.type === "income"
            ? sum + transaction.amount
            : sum - transaction.amount,
        0,
      ),
    );
  }, [transactionData]);

  return (
    <Layout style={{ minHeight: "100vh" }}>

      {/* Main Content */}
      <Content style={{ padding: "20px" }}>
        <Spin spinning={isLoading}>
          <Typography.Title level={2}>
            You have {summaryAmount} Baht
          </Typography.Title>
          <AddItem onItemAdded={(item) => console.log("Item Added:", item)} />
          <Divider>Transactions</Divider>
          <TransactionList
            data={transactionData}
            onNoteChanged={(id, note) => console.log("Note Updated:", id, note)}
            onRowEdited={(record) => console.log("Edit Row:", record)}
            onRowDeleted={(id) => console.log("Delete Row:", id)}
          />
          {currentEditRecord && (
            <EditItem
              isOpen={isEditModalOpen}
              item={currentEditRecord}
              onCancel={() => setIsEditModalOpen(false)}
              onItemEdited={(updatedItem) => {
                console.log("Item Edited:", updatedItem);
                setIsEditModalOpen(false);
              }}
            />
          )}
        </Spin>
      </Content>
    </Layout>
  );
}

export default FinanceScreen;
