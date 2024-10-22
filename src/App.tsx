import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { MantineProvider, Progress } from "@mantine/core";
import { theme } from "./theme";
import { HeaderMegaMenu } from "./components/HeaderMegaMenu/HeaderMegaMenu";
import { Group, Paper, SimpleGrid, Text } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import {
  IconUserPlus,
  IconDiscount2,
  IconReceipt2,
  IconCoin,
  IconArrowUpRight,
  IconArrowDownRight,
} from "@tabler/icons-react";
import classesCards from "./StatsGrid.module.css";
import { TableListAccountsPayable } from "./pages/ListAccountsPayable/TableListAccountsPayable";
import { Route, Routes } from "react-router-dom";
import { ListInstallmentsAccountPayable } from "./pages/ListInstallmentsAccountPayable/ListInstallmentsAccountPayable";
import { AccountsPayableProvider } from "./contexts/AccountsPayableContext";

const icons = {
  user: IconUserPlus,
  discount: IconDiscount2,
  receipt: IconReceipt2,
  coin: IconCoin,
};

const dataCards = [
  { title: "Total Pago", icon: "receipt", value: "13,456", diff: 34 },
  { title: "Total Devedor", icon: "coin", value: "4,145", diff: -13 },
  { title: "Dívidas", icon: "discount", value: "10/50", diff: null },
] as const;

export default function App() {
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
              c={stat.diff > 0 ? "teal" : "red"}
              fz="sm"
              fw={500}
              className={classesCards.diff}
            >
              <span>{stat.diff}%</span>
              <DiffIcon size="1rem" stroke={1.5} />
            </Text>
          )}
        </Group>

        {index == 2 && <Progress value={54.31} mt="md" size="lg" radius="xl" />}
      </Paper>
    );
  });

  return (
    <AccountsPayableProvider>
      <MantineProvider theme={theme}>
        <Notifications />
        <HeaderMegaMenu />

        <div className={classesCards.root}>
          <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }}>{stats}</SimpleGrid>
        </div>

        <div className={classesCards.root}>
          <Routes>
            <Route index element={<TableListAccountsPayable />} />
            <Route
              path="/installments/:id"
              element={<ListInstallmentsAccountPayable />}
            />
          </Routes>
        </div>
      </MantineProvider>
    </AccountsPayableProvider>
  );
}
