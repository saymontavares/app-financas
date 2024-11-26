import { useEffect, useState } from "react";
import {
  ListAccountsPayable,
  useAccountsPayable,
} from "../../contexts/AccountsPayableContext";
import { Box, Grid, Stack, TextInput } from "@mantine/core";
import { CardListAccountsPayableItem } from "./TableListAccountsPayableItem";
import { TableListAccountsPayableSkeleton } from "./TableListAccountsPayableSkeleton";
import { CardsHomeStates } from "../ListInstallmentsAccountPayable/components/CardsHomeStates";

export const TableListAccountsPayable = () => {
  const { accountsPayable, loading } = useAccountsPayable();
  const [search, setSearch] = useState("");
  const [accountsPayableSearched, setAccountsPayableSearched] = useState<
    ListAccountsPayable[]
  >([]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
  };

  const filterData = (data: ListAccountsPayable[], search: string) => {
    const query = search.toLowerCase().trim();
    return data.filter((item) =>
      Object.keys(data[0]).some((key) =>
        item[key as keyof ListAccountsPayable]
          .toString()
          .toLowerCase()
          .includes(query)
      )
    );
  };

  useEffect(() => {
    const searching = filterData(accountsPayable, search);
    setAccountsPayableSearched(searching);
  }, [search, accountsPayable]);

  return (
    <>
      <CardsHomeStates accountsPayable={accountsPayable} />
      <Box>
        <TextInput
          placeholder="Buscar..."
          mb="md"
          value={search}
          onChange={handleSearchChange}
        />
      </Box>
      {!loading && (
        <Stack>
          <Grid>
            {accountsPayableSearched.map((payable, index) => (
              <CardListAccountsPayableItem key={index} payable={payable} />
            ))}
          </Grid>
        </Stack>
      )}

      {loading && <TableListAccountsPayableSkeleton />}
    </>
  );
};
