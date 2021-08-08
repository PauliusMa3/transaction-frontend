import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Select from "react-select";
import Loader from "react-loader-spinner";
import "./style.scss";
import Input from "./Input";
import { IOptionItem } from "features/Transaction";
import moment from "moment";

export const typeErrorMessages = {
  invalidDate: "You must specify date in format: YYYY-MM-DD",
  invalidNumber: "You must specify a number"
};

const schema = yup.object().shape({
  date: yup
    .date()
    .typeError(typeErrorMessages.invalidDate)
    .transform(function (value: any) {
      const parsed = moment(value, "YYYY-MM-DD", true);
      return parsed.isValid() ? parsed.toDate() : new Date("");
    })
    .required("Required"),
  amount: yup.number().typeError(typeErrorMessages.invalidNumber).required(""),
  currency: yup.string().required("You must select currency"),
  client_id: yup
    .number()
    .integer()
    .typeError(typeErrorMessages.invalidNumber)
    .required("Required")
});

export interface IFormData {
  client_id: string;
  amount: string;
  currency: string;
  date: string;
}

interface IFormProps {
  status: string;
  currencyList: IOptionItem[];
  onSubmit: (formData: IFormData) => void;
  error: any;
}

const Form = ({ currencyList, status, onSubmit, error }: IFormProps) => {
  const {
    handleSubmit,
    control,
    register,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: yupResolver(schema)
  });

  const isLoading = status === "idle" || isSubmitting;

  const onFormSubmit = (formData: IFormData) => {
    const { date, amount } = formData;
    const requestFormData = {
      ...formData,
      date: moment(date).format("YYYY-MM-DD"),
      amount: amount.toString()
    };

    onSubmit(requestFormData);
    reset();
  };
  return (
    <div className="form-container">
      {!isLoading && error ? <p className="error-message">{error}</p> : null}
      {isLoading ? (
        <Loader type="TailSpin" color="#0198E1" height={100} width={100} />
      ) : null}
      {!isLoading ? (
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <h2>Transaction Form</h2>
          <Input
            name={"client_id"}
            label="Client Id"
            register={register}
            error={errors["client_id"]}
          />

          <Input
            name={"amount"}
            label="Amount"
            register={register}
            error={errors["amount"]}
          />

          <Input
            name={"date"}
            label="Date"
            register={register}
            error={errors["date"]}
          />
          <>
            <Controller
              name="currency"
              control={control}
              render={({ field: { onChange, value, ref } }) => (
                <div className="select-container">
                  <label>Currency</label>
                  <Select
                    inputRef={ref}
                    classNamePrefix="addl-class"
                    options={currencyList}
                    value={currencyList.find((c) => c.value === value)}
                    onChange={(val) => {
                      if (val) {
                        onChange(val.value);
                      }
                    }}
                  />
                </div>
              )}
            />
            {errors["currency"] ? (
              <p className="error-message">{errors["currency"].message}</p>
            ) : null}
          </>
          <button type="submit">Submit</button>
        </form>
      ) : null}
    </div>
  );
};

export default Form;
