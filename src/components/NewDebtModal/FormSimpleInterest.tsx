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
  itPaid: boolean;
};

type FormValues = {
  name: string;
  capital: number;
  rate: number;
  time: number;
  type: TypesOfInterest;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  interest?: Installment[];
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

export const FormSimpleInterest = ({ type, close }: Props) => {
  const form = useForm<FormValues>({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      capital: 0,
      rate: 0,
      time: 1,
      type: TypesOfInterest.SIMPLE,
    },
    validate: zodResolver(schema),
  });
  const [loading, setLoading] = useState(false);
  const { fetchAccountsPayable } = useAccountsPayable();

  const calculateSimpleInterest = async (values: FormValues) => {
    try {
      setLoading(true);

      await api.post("accounts-payable", { ...values, type: type });

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

      throw new Error(error.message);
    }
  };

  return (
    <form
      onSubmit={form.onSubmit((values: FormValues) => {
        calculateSimpleInterest(values);
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
