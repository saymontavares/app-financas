import { useState } from "react";
import { Button, NumberInput, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { z } from "zod";
import { IconCheck } from "@tabler/icons-react";
import { api } from "../../http-client";
import { AxiosError } from "axios";
import { TypesOfInterest } from "./enums/TypesOfInterest";
import { useAccountsPayable } from "../../contexts/AccountsPayableContext";

type Installment = {
  installmentNumber: number;
  totalPaid: number;
  accruedInterest: number;
  installmentValue: number;
  itPaid: boolean;
};

type FormValues = {
  name: string;
  capital: number;
  rate: number;
  time: number;
  type: TypesOfInterest;
  totalInterest?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  installments: Installment[];
};

type Props = {
  type: TypesOfInterest;
  close: () => void;
};

const schema = z.object({
  name: z.string().trim().min(1, "Preencha o campo"),
  capital: z.number().min(1, "Capital deve ser maior que 0"),
  rate: z.number().min(1, "Taxa deve ser maior que 0"),
  time: z.number().min(1, "Tempo deve ser maior que 0"),
});

export const FormCompoundInterest = ({ close }: Props) => {
  const form = useForm<FormValues>({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      capital: 0,
      rate: 0,
      time: 1,
      type: TypesOfInterest.COMPOSITE,
      installments: [], // Inicializa com uma lista vazia de parcelas
    },
    validate: zodResolver(schema),
  });
  const [loading, setLoading] = useState(false);
  const { fetchAccountsPayable } = useAccountsPayable();

  const calculateCompoundInterest = async (values: FormValues) => {
    try {
      setLoading(true);

      // Cálculo dos juros compostos
      const totalInterest =
        values.capital * Math.pow(1 + values.rate / 100, values.time) -
        values.capital;

      // Gerando as parcelas
      const installments: Installment[] = [];
      for (let i = 1; i <= values.time; i++) {
        const installmentValue =
          (values.capital * Math.pow(1 + values.rate / 100, i) -
            values.capital) /
          values.time;

        installments.push({
          installmentNumber: i,
          totalPaid: 0,
          accruedInterest: installmentValue,
          installmentValue: installmentValue,
          itPaid: false,
        });
      }

      // Envia os dados para a API
      await api.post("accounts-payable", {
        ...values,
        type: TypesOfInterest.COMPOSITE,
        totalInterest,
        installments,
      });

      notifications.show({
        title: "Tudo certo!",
        message: "Dívida cadastrada com sucesso.",
        color: "green",
        icon: <IconCheck />,
      });

      setLoading(false);
      close();
      await fetchAccountsPayable();
    } catch (e) {
      const error = e as AxiosError;
      notifications.show({
        title: "Erro",
        message: error.message,
        color: "red",
      });
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={form.onSubmit((values: FormValues) => {
        calculateCompoundInterest(values);
      })}
    >
      <TextInput
        {...form.getInputProps("name")}
        key={form.key("name")}
        label="Nome da Dívida"
        placeholder="Financiamento do Carro"
      />
      <NumberInput
        {...form.getInputProps("capital")}
        key={form.key("capital")}
        label="Capital (Valor Inicial)"
        placeholder="10000"
      />
      <NumberInput
        {...form.getInputProps("rate")}
        key={form.key("rate")}
        label="Taxa de Juros (%)"
        placeholder="5"
      />
      <NumberInput
        {...form.getInputProps("time")}
        key={form.key("time")}
        label="Tempo (em meses)"
        placeholder="12"
      />

      <Button
        loading={loading}
        leftSection={<IconCheck />}
        type="submit"
        mt="md"
        fullWidth
      >
        Finalizar
      </Button>
    </form>
  );
};
