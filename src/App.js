import "./App.css";
import { useEffect, useState } from "react";
import { format } from "date-fns";

function App() {
  const [name, setName] = useState("");
  const [datetime, setDatetime] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);

  async function getTransactions() {
    const url = process.env.REACT_APP_API_URL + "/transactions";
    const response = await fetch(url);
    return await response.json();
  }

  function addNewTransaction(ev) {
    ev.preventDefault();
    const url = process.env.REACT_APP_API_URL + "/transaction";
    // console.log(url);

    const price = name.split(" ")[0];

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        price,
        name: name.substring(price.length + 1),
        description,
        datetime,
      }),
    }).then((response) => {
      response.json().then((json) => {
        setName("");
        setDatetime("");
        setDescription("");
        console.log("result", json);
      });
    });
  }

  function deleteTransaction(id) {
    const url = process.env.REACT_APP_API_URL + `/transaction/${id}`;

    fetch(url, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setTransactions((prevTransactions) =>
            prevTransactions.filter((transaction) => transaction._id !== id)
          );
        } else {
          console.error("Failed to delete transaction");
        }
      })
      .catch((err) => {
        console.error("Failed to delete transaction: ", err);
      });
  }

  let balance = 0;
  for (const transaction of transactions) {
    if (!isNaN(transaction.price)) {
      balance += transaction.price;
    }
  }

  balance = balance.toFixed(2);
  const fraction = balance.split(".")[1];
  balance = balance.split(".")[0];

  return (
    <div>
      <main>
        <h1>
          ${balance}
          <span>{fraction}</span>
        </h1>
        <div className="search-bar">
          <input
            type="text"
            value={search}
            onChange={(ev) => setSearch(ev.target.value)}
            placeholder="Search"
          />
        </div>
        <form onSubmit={addNewTransaction}>
          <div className="basic">
            <input
              type="text"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              placeholder={"+200 new samsung tv"}
            />
            <input
              type="datetime-local"
              value={datetime}
              onChange={(ev) => setDatetime(ev.target.value)}
            />
          </div>
          <div className="description">
            <input
              type="text"
              value={description}
              onChange={(ev) => setDescription(ev.target.value)}
              placeholder={"description"}
            />
          </div>
          <button type="submit">Add new transaction</button>
        </form>
        <div className="transactions">
          {transactions.length > 0 &&
            transactions.map((transaction) => {
              return (
                <div className="transaction" key={transaction._id}>
                  <div className="left">
                    <div className="name">{transaction.name}</div>
                    <div className="description">{transaction.description}</div>
                  </div>
                  <div className="right">
                    <div
                      className={`price ${
                        transaction.price < 0 ? "red" : "green"
                      }`}
                    >
                      {transaction.price}
                    </div>
                    <div className="date-time">
                      {format(
                        new Date(transaction.datetime),
                        "yyyy-MM-dd HH:mm"
                      )}
                    </div>
                    <button onClick={() => deleteTransaction(transaction._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}

          {/* <div className="transaction">
            <div className="left">
              <div className="name">Gig web site</div>
              <div className="description">it was time for new tv</div>
            </div>
            <div className="right">
              <div className="price green">+$500</div>
              <div className="date-time">2022-12-18 15:45</div>
            </div>
          </div>
          <div className="transaction">
            <div className="left">
              <div className="name">Iphone</div>
              <div className="description">it was time for new tv</div>
            </div>
            <div className="right">
              <div className="price red">-$900</div>
              <div className="date-time">2022-12-18 15:45</div>
            </div>
          </div> */}
        </div>
      </main>
    </div>
  );
}

export default App;
