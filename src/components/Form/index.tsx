import {useEffect, useState} from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Select from 'react-select'
import Loader from "react-loader-spinner";
import axios from "axios";
import { API_URL } from "../../constants";
import './style.scss'

const schema = yup.object().shape({
    date: yup.date().required(),
    amount: yup.number().required(),
    currency: yup.string().required(),
    clientId: yup.number().integer()
  });

interface IOptionItem {
    label: string,
    value: string
}

const Form  = () => {
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState(null);
    const [currencyList, setCurrencyList] = useState<IOptionItem[]>([]);

    useEffect(() => {
        const fetchCurrencyOptions = async () => {
            try {
                const {data} = await axios.get(`${API_URL}/transaction/currencies`);
                const currencyList:any = Object.keys(data?.rates).map((key:string) => ({label:key, value:key}))
                setCurrencyList(currencyList)
                setStatus('resolved');
            } catch(e: any) {
                setError(e.message);
                setStatus('rejected');
            }
        }
            fetchCurrencyOptions()
    }, [])


  const { handleSubmit, control, register,formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async(formData: any) => {
    try {
        const {data: commision} = await axios.post(`${API_URL}/transaction`, {
            formData
        });
        console.log('currencies: ', commision);
        setStatus('resolved');
    } catch(e: any) {
        setError(e.message);
        setStatus('rejected');
    }
  }

  const isLoading = status === 'idle';

  return (
      <div className='form-container'>
          {
              isLoading ?
              <Loader
              type="Puff"
              color="#00BFFF"
              height={100}
              width={100}
              timeout={3000} //3 secs
            /> : null
          }
          {
              !isLoading && error ? (
                <form onSubmit={handleSubmit(onSubmit)}>
                <input {...register("clientId")} placeholder='Client Id'/>
                {errors.clientId?.message ? <p>{errors.clientId?.message}</p> : null}
                <input {...register("amount")} placeholder={'Amount'} />
                {errors.amount?.message ? <p>{errors.amount?.message}</p> : null}
                <input {...register("date")} placeholder='Date'/>
                {errors.date?.message ? <p>{errors.date?.message}</p> : null}
                <Controller
                    name="currency"
                    control={control}
                    render={({ field }) => <Select
                      {...field}
                      options={currencyList}
                    />}
                  />
                    <button type='submit'>Submit</button>
                </form>
              ) : null
          }

      </div>
  );
}

export default Form;