import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../http-client";
import { AxiosError } from "axios";
import { AccountsPayable } from "../../contexts/AccountsPayableContext";
import {
  Badge,
  Checkbox,
  Group,
  rem,
  ScrollArea,
  Table,
  Text,
} from "@mantine/core";
import cx from "clsx";
import classes from "./ListInstallmentsAccountPayable.module.css";
import { ListInstallmentsAccountPayableSkeleton } from "./ListInstallmentsAccountPayableSkeleton";

export const ListInstallmentsAccountPayable = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [selection, setSelection] = useState([""]);
  const [listInstallments, setListInstallments] = useState<
    Partial<AccountsPayable>
  >({});

  const fetchAccountsPayableInstallments = async () => {
    try {
      setLoading(true);
      const res = await api.get(`accounts-payable/${id}`);
      setListInstallments(res.data);

      if (
        listInstallments.installments &&
        listInstallments.installments.length > 0
      ) {
        const installments = res.data.installments
          ?.filter((item: { itPaid: boolean }) => item.itPaid)
          .map((item: { id: string }) => item.id.toString());

        setSelection(installments);
      }
    } catch (e) {
      const error = e as AxiosError;
      throw new Error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountsPayableInstallments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleRow = (id: string) =>
    setSelection((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  const toggleAll = () =>
    setSelection((current) =>
      listInstallments.installments &&
      current.length === listInstallments.installments.length
        ? []
        : listInstallments.installments?.map((item) => item.id.toString()) || []
    );

  const rows = listInstallments.installments?.map((item) => {
    const selected = selection.includes(item.id.toString());
    return (
      <Table.Tr
        key={item.id}
        className={cx({ [classes.rowSelected]: selected })}
      >
        <Table.Td>
          <Checkbox
            checked={selection.includes(item.id.toString())}
            onChange={() => toggleRow(item.id.toString())}
          />
        </Table.Td>
        <Table.Td>
          <Group gap="sm">
            <Text size="sm" fw={500}>
              {item.installmentNumber}
            </Text>
          </Group>
        </Table.Td>
        <Table.Td>R$ {item.installmentValue.toLocaleString()}</Table.Td>
        <Table.Td>
          {item.itPaid && <Badge color="lime">PAGA</Badge>}
          {!item.itPaid && <Badge color="yellow">EM ABERTA</Badge>}
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <>
      <Text>{listInstallments.name}</Text>

      <ScrollArea>
        <Table miw={800} verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: rem(40) }}>
                <Checkbox
                  onChange={toggleAll}
                  checked={
                    selection.length === listInstallments.installments?.length
                  }
                  indeterminate={
                    selection.length > 0 &&
                    selection.length !== listInstallments.installments?.length
                  }
                />
              </Table.Th>
              <Table.Th>Parcela</Table.Th>
              <Table.Th>Valor da Parcela</Table.Th>
              <Table.Th>Parcela Paga</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>

      {loading && <ListInstallmentsAccountPayableSkeleton />}
    </>
  );
};
