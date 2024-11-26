import { Group, Paper, Progress, SimpleGrid, Space, Text } from "@mantine/core";
import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconCoin,
  IconDiscount2,
  IconReceipt2,
  IconUserPlus,
} from "@tabler/icons-react";
import classesCards from "./CardsHomeStates.module.css";
import { ListAccountsPayable } from "../../../contexts/AccountsPayableContext";

interface CardsHomeStatesProps {
  accountsPayable: ListAccountsPayable[];
}

const icons = {
  user: IconUserPlus,
  discount: IconDiscount2,
  receipt: IconReceipt2,
  coin: IconCoin,
};

export const CardsHomeStates = ({ accountsPayable }: CardsHomeStatesProps) => {
  const totalInstallmentsPaid = accountsPayable.reduce((total, item) => {
    const paidTotal = item.installments.filter(
      (installment) => installment.itPaid
    ).length;
    return total + paidTotal;
  }, 0);

  const totalInstallments = accountsPayable.reduce((total, item) => {
    const totalItemInstallments = item.installments.length;
    return total + totalItemInstallments;
  }, 0);

  const totalPaid = accountsPayable.reduce((total, item) => {
    const paidTotal = item.installments
      .filter((installment) => installment.itPaid)
      .reduce(
        (sum, installment) =>
          sum + parseFloat(installment.installmentValue.toString()),
        0
      );
    return total + paidTotal;
  }, 0);

  const totalUnpaid = accountsPayable.reduce((total, item) => {
    const unpaidTotal = item.installments
      .filter((installment) => !installment.itPaid)
      .reduce(
        (sum, installment) =>
          sum + parseFloat(installment.installmentValue.toString()),
        0
      );
    return total + unpaidTotal;
  }, 0);
  const percentageInstallmentsPaid =
    (totalInstallmentsPaid / totalInstallments) * 100;
  const totalAmount = totalPaid + totalUnpaid;
  const paidPercentage = (totalPaid / totalAmount) * 100;
  const unpaidPercentage = (totalUnpaid / totalAmount) * 100;
  const dataCards = [
    {
      title: "Total Pago",
      icon: "receipt",
      value: totalPaid.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
      diff: paidPercentage,
      percent: null,
      textColor: "teal",
    },
    {
      title: "Total Devedor",
      icon: "coin",
      value: totalUnpaid.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
      diff: unpaidPercentage,
      percent: null,
      textColor: "red",
    },
    {
      title: "Total Parcelas",
      icon: "discount",
      value: `${totalInstallmentsPaid}/${totalInstallments}`,
      diff: percentageInstallmentsPaid ?? 0,
      percent: percentageInstallmentsPaid ?? 0,
      textColor: "teal",
    },
  ] as const;

  const stats = dataCards.map((stat, index) => {
    const Icon = icons[stat.icon];
    const DiffIcon =
      stat.diff && stat.diff > 0 ? IconArrowUpRight : IconArrowDownRight;

    return (
      <Paper withBorder p="md" radius="md" key={stat.title}>
        <Group justify="space-between">
          <Text size="xs" c="dimmed" className={classesCards.title}>
            {stat.title}
          </Text>
          <Icon className={classesCards.icon} size="1.4rem" stroke={1.5} />
        </Group>

        <Group align="flex-end" gap="xs" mt={25}>
          <Text className={classesCards.value}>{stat.value}</Text>
          {stat.diff && (
            <Text
              c={stat.textColor}
              fz="sm"
              fw={500}
              className={classesCards.diff}
            >
              <span>{stat.diff.toFixed(0)}%</span>
              <DiffIcon size="1rem" stroke={1.5} />
            </Text>
          )}
        </Group>

        {index == 2 && (
          <Progress value={stat.percent ?? 0} mt="md" size="lg" radius="xl" />
        )}
      </Paper>
    );
  });

  return (
    <>
      <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} className="mb-5">
        {stats}
      </SimpleGrid>
      <Space h="md" />
    </>
  );
};
