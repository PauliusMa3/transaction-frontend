import Form, { IFormData } from "components/Form";
import "./style.scss";
import { useState, useEffect } from "react";

import axios from "axios";
import { API_URL } from "../../constants";
import Loader from "react-loader-spinner";

interface ICommission {
  amount: string;
  currency: string;
}

export interface IOptionItem {
  label: string;
  value: string;
}

const TransactionWidget = () => {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [currencyList, setCurrencyList] = useState<IOptionItem[]>([]);
  const [commissionData, setCommissionData] = useState<ICommission>();

  useEffect(() => {
    const fetchCurrencyOptions = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/transaction/currencies`);
        setCurrencyList(
          data?.currencies.map((currency: string) => ({
            label: currency,
            value: currency
          }))
        );
        setStatus("resolved");
      } catch (e: any) {
        setError(e.message);
        setStatus("rejected");
      }
    };
    fetchCurrencyOptions();
  }, []);

  const onTransactionFormSubmit = async (formData: IFormData) => {
    try {
      setError(null);
      setStatus("idle");
      const { data: commission } = await axios.post(`${API_URL}/transaction`, formData);
      setCommissionData(commission);
      setStatus("resolved");
    } catch (e: any) {
      setError(e.message);
      setStatus("rejected");
    }
  };

  const isLoading = status === "idle";
  return (
    <div className="transaction-widget-container">
      <Form
        onSubmit={onTransactionFormSubmit}
        status={status}
        currencyList={currencyList}
        error={error}
      />

      {commissionData && !isLoading ? (
        <div className="commission-info-block">
          <h2>Transaction Commission</h2>
          <p>
            <span>Amount: </span>
            {commissionData?.amount ?? 0}
          </p>
          <p>
            <span>Currency: </span>
            {commissionData?.currency ?? "EUR"}
          </p>
        </div>
      ) : null}
      {commissionData && isLoading ? (
        <div className="commission-info-block">
          <Loader type="TailSpin" color="#0198E1" height={100} width={100} />
        </div>
      ) : null}
    </div>
  );
};

export default TransactionWidget;
