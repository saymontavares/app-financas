import {
  Badge,
  Card,
  Grid,
  Group,
  Progress,
  Text,
  ThemeIcon,
} from "@mantine/core";
import {
  ListAccountsPayable,
  PayableType,
} from "../../contexts/AccountsPayableContext";
import { IconCalendar, IconCash, IconCashBanknoteFilled, IconCirclePercentage } from "@tabler/icons-react";
import { Link } from "react-router-dom";

type Props = {
  payable: ListAccountsPayable;
};

export const CardListAccountsPayableItem = ({ payable }: Props) => {
  return (
    <Grid.Col span={6}>
      <Card
        shadow="sm"
        padding="md"
        radius="md"
        withBorder
        component={Link}
        to={`/installments/${payable.id}`}
        style={{ textDecoration: "none" }}
      >
        <Group mb="md">
          <Text fw={600}>{payable.name}</Text>
          <Badge color="green" variant="light">
            {`${payable.rate}% Juros`}
          </Badge>
        </Group>

        <Group align="center">
          <Group>
            <ThemeIcon radius="md" variant="light">
              <IconCash size={16} />
            </ThemeIcon>
            <Text size="sm" color="dimmed">
              {Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(payable.capital)}
            </Text>
          </Group>

          <Group>
            <ThemeIcon radius="md" variant="light">
              <IconCashBanknoteFilled size={16} />
            </ThemeIcon>
            <Text size="sm" color="dimmed">
              {Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(payable.totalInterest)}
            </Text>
          </Group>

          <Group>
            <ThemeIcon radius="md" variant="light">
              <IconCalendar size={16} />
            </ThemeIcon>
            <Text size="sm" color="dimmed">
              {payable.time} meses
            </Text>
          </Group>

          <Group>
            <ThemeIcon radius="md" variant="light">
              <IconCirclePercentage size={16} />
            </ThemeIcon>
            {payable.type == PayableType.SIMPLE && (
              <Text size="sm" color="dimmed">
                SIMPLES
              </Text>
            )}
            {payable.type == PayableType.COMPOSITE && (
              <Text size="sm" color="dimmed">
                COMPOSTO
              </Text>
            )}
          </Group>
        </Group>

        <Group mt="md" align="center">
          <Text size="sm">Progresso</Text>
          <Progress
            value={payable.percentageInstallmentsPaid}
            size="lg"
            striped
            animated
            color="teal"
            radius="xl"
            style={{ flexGrow: 1 }}
          />
        </Group>
      </Card>
    </Grid.Col>
  );
};
