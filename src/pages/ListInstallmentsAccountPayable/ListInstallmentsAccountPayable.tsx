import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../http-client";
import { AxiosError } from "axios";
import {
  AccountsPayable,
  PayableStatus,
  PayableType,
  useAccountsPayable,
} from "../../contexts/AccountsPayableContext";
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
  Grid,
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
import { notifications } from "@mantine/notifications";

export const ListInstallmentsAccountPayable = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [selection, setSelection] = useState<string[]>([]);
  const [listInstallments, setListInstallments] = useState<
    Partial<AccountsPayable>
  >({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [newSelection, setNewSelection] = useState<string[]>([]);
  const { fetchAccountsPayable } = useAccountsPayable();

  const fetchAccountsPayableInstallments = useCallback(async () => {
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
  }, [id]);

  useEffect(() => {
    fetchAccountsPayableInstallments();
  }, [fetchAccountsPayableInstallments]);

  const confirmSelection = async () => {
    try {
      setLoading(true);
      setShowConfirmation(false);
      setSelection(newSelection);

      await api.patch(`/accounts-payable-installment/${id}`, {
        installments: newSelection,
      });
      await fetchAccountsPayableInstallments();
      await fetchAccountsPayable();

      notifications.show({
        title: "Tudo certo!",
        message: "Parcela atualizada com sucesso.",
        color: "green",
        icon: <IconCheck />,
      });
    } catch (e) {
      const error = e as AxiosError;
      throw new Error(error.message);
    } finally {
      setLoading(false);
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
                {listInstallments.type == PayableType.SIMPLE && "SIMPLES"}
                {listInstallments.type == PayableType.COMPOSITE && "COMPOSTO"}
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
                {listInstallments.status == PayableStatus.PENDING && "PENDENTE"}
                {listInstallments.status == PayableStatus.PAID && "PAGO"}
                {listInstallments.status == PayableStatus.CANCELLED &&
                  "CANCELADO"}
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
                ).length ?? 0
              }/${listInstallments.installments?.length ?? 0}`}</Text>
            </Group>
            {/* Calculando o progresso com base nas parcelas pagas */}
            <Progress
              value={
                ((listInstallments.installments?.filter(
                  (installment) => installment.itPaid
                ).length ?? 0) /
                  (listInstallments.installments?.length ?? 1)) *
                100
              }
              size="lg"
              mt="md"
            />
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
        title="Alterar Parcela(s)"
      >
        <Group>
          <Grid columns={12} gutter="md">
            <Grid.Col span={12}>
              <Text>Deseja realmente atualizar as parcelas selecionadas?</Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Button fullWidth onClick={() => setShowConfirmation(false)}>
                Cancelar
              </Button>
            </Grid.Col>
            <Grid.Col span={6}>
              <Button fullWidth color="teal" onClick={confirmSelection}>
                Confirmar
              </Button>
            </Grid.Col>
          </Grid>
        </Group>
      </Modal>
    </>
  );
};
