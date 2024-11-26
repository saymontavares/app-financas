import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { api } from "../http-client";
import { AxiosError } from "axios";

export type ListAccountsPayable = {
  id: number;
  name: string;
  capital: number;
  rate: number;
  time: number;
  totalInterest: number;
  percentageInstallmentsPaid: number;
  type: PayableType;
  installments: Installment[];
};

export enum PayableType {
  SIMPLE = "SIMPLE",
  COMPOSITE = "COMPOSITE",
}

export enum PayableStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
}

// Definindo o tipo para as parcelas (installments)
export type Installment = {
  id: number;
  accountId: number;
  installmentNumber: number;
  totalPaid: number; // Corrigido para number
  accruedInterest: number; // Corrigido para number
  installmentValue: number; // Corrigido para number
  itPaid: boolean;
  createdAt: string;
  updatedAt: string;
};

// Definindo o tipo para o objeto principal (AccountsPayable)
export type AccountsPayable = {
  id: number;
  name: string;
  capital: number; // Corrigido para number
  rate: number;
  time: number;
  totalToPay: number;
  type: PayableType; // Usando o enum PayableType
  totalInterest: number; // Corrigido para number
  status: PayableStatus; // Usando o enum PayableStatus
  createdAt: string;
  updatedAt: string;
  installments: Installment[]; // Relacionamento com Installments
};

type AccountsPayableContextType = {
  accountsPayable: ListAccountsPayable[];
  loading: boolean;
  fetchAccountsPayable: () => Promise<void>;
};

const AccountsPayableContext = createContext<
  AccountsPayableContextType | undefined
>(undefined);

export const useAccountsPayable = () => {
  const context = useContext(AccountsPayableContext);

  if (!context) {
    throw new Error(
      "useAccountsPayable must be used within a AccountsPayableProvider"
    );
  }

  return context;
};

export const AccountsPayableProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [accountsPayable, setAccountsPayable] = useState<ListAccountsPayable[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  const fetchAccountsPayable = async () => {
    try {
      setLoading(true);
      const res = await api.get("accounts-payable");
      setAccountsPayable(res.data);
    } catch (e) {
      const error = e as AxiosError;
      throw new Error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountsPayable();
  }, []);

  return (
    <AccountsPayableContext.Provider
      value={{ accountsPayable, loading, fetchAccountsPayable }}
    >
      {children}
    </AccountsPayableContext.Provider>
  );
};
