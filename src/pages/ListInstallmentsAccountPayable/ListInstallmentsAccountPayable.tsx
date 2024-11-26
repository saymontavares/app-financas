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
  Modal,
  Button,
  Paper,
  SimpleGrid,
  Progress,
  Divider,
  ThemeIcon,
} from "@mantine/core";
import cx from "clsx";
import classes from "./ListInstallmentsAccountPayable.module.css";
import { ListInstallmentsAccountPayableSkeleton } from "./ListInstallmentsAccountPayableSkeleton";
import {
  IconCalendar,
  IconCategory2,
  IconCheck,
  IconClock,
  IconMoneybag,
  IconPercentage,
  IconReceipt2,
} from "@tabler/icons-react";
import classesCards from "./../ListInstallmentsAccountPayable/components/CardsHomeStates.module.css";

export const ListInstallmentsAccountPayable = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [selection, setSelection] = useState<string[]>([]);
  const [listInstallments, setListInstallments] = useState<
    Partial<AccountsPayable>
  >({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [newSelection, setNewSelection] = useState<string[]>([]);

  const fetchAccountsPayableInstallments = async () => {
    try {
      setLoading(true);
      const res = await api.get(`accounts-payable/${id}`);
      setListInstallments(res.data);

      if (res.data.installments) {
        const installments = res.data.installments
          .filter((item: { itPaid: boolean }) => item.itPaid)
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
  }, [id]);

  const confirmSelection = async () => {
    setShowConfirmation(false);
    setSelection(newSelection);

    try {
      await api.post("/update-installments", { installments: newSelection });
    } catch (e) {
      const error = e as AxiosError;
      console.error("Erro ao atualizar as parcelas:", error.message);
    }
  };

  const toggleRow = (id: string) => {
    const updatedSelection = selection.includes(id)
      ? selection.filter((item) => item !== id)
      : [...selection, id];
    setNewSelection(updatedSelection);
    setShowConfirmation(true);
  };

  const toggleAll = () => {
    const updatedSelection =
      listInstallments.installments &&
      selection.length === listInstallments.installments.length
        ? []
        : listInstallments.installments?.map((item) => item.id.toString()) ||
          [];

    setNewSelection(updatedSelection);
    setShowConfirmation(true);
  };

  const rows = listInstallments.installments?.map((item) => {
    const selected = selection.includes(item.id.toString());
    return (
      <Table.Tr
        key={item.id}
        className={cx({ [classes.rowSelected]: selected })}
      >
        <Table.Td>
          <Checkbox
            checked={selected}
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
          {item.itPaid ? (
            <Badge color="lime">PAGA</Badge>
          ) : (
            <Badge color="yellow">EM ABERTA</Badge>
          )}
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <>
      <Text size="xl" mb="md">
        {listInstallments.name}
      </Text>

      {!loading && (
        <SimpleGrid cols={{ base: 1, md: 4 }} className="mb-5">
          {" "}
          {/* Define 4 colunas para desktop e 1 para mobile */}
          <Paper withBorder p="md" radius="md">
            <Group justify="space-between">
              <Text size="xs" color="dimmed" className={classesCards.title}>
                Capital
              </Text>
              <ThemeIcon radius="md" variant="light">
                <IconMoneybag size="1.4rem" stroke={1.5} />
              </ThemeIcon>
            </Group>
            <Group align="flex-end" gap="xs" mt={25}>
              <Text className={classesCards.value}>
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(listInstallments.capital ?? 0)}
              </Text>
            </Group>
          </Paper>
          <Paper withBorder p="md" radius="md">
            <Group justify="space-between">
              <Text size="xs" color="dimmed" className={classesCards.title}>
                Taxa
              </Text>
              <ThemeIcon radius="md" variant="light">
                <IconPercentage size="1.4rem" stroke={1.5} />
              </ThemeIcon>
            </Group>
            <Group align="flex-end" gap="xs" mt={25}>
              <Text className={classesCards.value}>
                {listInstallments.rate}%
              </Text>
            </Group>
          </Paper>
          <Paper withBorder p="md" radius="md">
            <Group justify="space-between">
              <Text size="xs" color="dimmed" className={classesCards.title}>
                Tempo
              </Text>
              <ThemeIcon radius="md" variant="light">
                <IconCalendar size="1.4rem" stroke={1.5} />
              </ThemeIcon>
            </Group>
            <Group align="flex-end" gap="xs" mt={25}>
              <Text className={classesCards.value}>
                {listInstallments.time} meses
              </Text>
            </Group>
          </Paper>
          <Paper withBorder p="md" radius="md">
            <Group justify="space-between">
              <Text size="xs" color="dimmed" className={classesCards.title}>
                Tipo
              </Text>
              <ThemeIcon radius="md" variant="light">
                <IconCategory2 size="1.4rem" stroke={1.5} />
              </ThemeIcon>
            </Group>
            <Group align="flex-end" gap="xs" mt={25}>
              <Text className={classesCards.value}>
                {listInstallments.type}
              </Text>
            </Group>
          </Paper>
          <Paper withBorder p="md" radius="md">
            <Group justify="space-between">
              <Text size="xs" color="dimmed" className={classesCards.title}>
                Juros Totais
              </Text>
              <ThemeIcon radius="md" variant="light">
                <IconMoneybag size="1.4rem" stroke={1.5} />
              </ThemeIcon>
            </Group>
            <Group align="flex-end" gap="xs" mt={25}>
              <Text className={classesCards.value}>
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(listInstallments.totalInterest ?? 0)}
              </Text>
            </Group>
          </Paper>
          <Paper withBorder p="md" radius="md">
            <Group justify="space-between">
              <Text size="xs" color="dimmed" className={classesCards.title}>
                Status
              </Text>
              <ThemeIcon radius="md" variant="light">
                <IconClock size="1.4rem" stroke={1.5} />
              </ThemeIcon>
            </Group>
            <Group align="flex-end" gap="xs" mt={25}>
              <Text className={classesCards.value}>
                {listInstallments.status}
              </Text>
            </Group>
          </Paper>
          <Paper withBorder p="md" radius="md">
            <Group justify="space-between">
              <Text size="xs" color="dimmed" className={classesCards.title}>
                Total a Pagar
              </Text>
              <ThemeIcon radius="md" variant="light">
                <IconReceipt2 size="1.4rem" stroke={1.5} />
              </ThemeIcon>
            </Group>
            <Group align="flex-end" gap="xs" mt={25}>
              <Text className={classesCards.value}>
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(listInstallments.totalToPay ?? 0)}
              </Text>
            </Group>
          </Paper>
          <Paper withBorder p="md" radius="md">
            <Group justify="space-between">
              <Text size="xs" color="dimmed" className={classesCards.title}>
                Parcelas Pagas
              </Text>
              <ThemeIcon radius="md" variant="light">
                <IconCheck size="1.4rem" stroke={1.5} />
              </ThemeIcon>
            </Group>
            <Group align="flex-end" gap="xs" mt={25}>
              <Text className={classesCards.value}>{`${
                listInstallments.installments?.filter(
                  (installment) => installment.itPaid
                ).length
              }/${listInstallments.installments?.length}`}</Text>
            </Group>
            <Progress value={(1 / 30) * 100} size="lg" mt="md" />{" "}
          </Paper>
        </SimpleGrid>
      )}

      <Divider h={"md"} />

      {!loading && (
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
      )}

      {loading && <ListInstallmentsAccountPayableSkeleton />}

      <Modal
        opened={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        title="Confirmar ação"
      >
        <Text>Deseja realmente atualizar as parcelas selecionadas?</Text>
        <Group mt="md">
          <Button onClick={() => setShowConfirmation(false)}>Cancelar</Button>
          <Button color="blue" onClick={confirmSelection}>
            Confirmar
          </Button>
        </Group>
      </Modal>
    </>
  );
};
