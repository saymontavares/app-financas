import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import { HeaderMegaMenu } from "./components/HeaderMegaMenu/HeaderMegaMenu";
import { Notifications } from "@mantine/notifications";
import classesCards from "./pages/ListInstallmentsAccountPayable/components/CardsHomeStates.module.css";
import { TableListAccountsPayable } from "./pages/ListAccountsPayable/TableListAccountsPayable";
import { Route, Routes } from "react-router-dom";
import { ListInstallmentsAccountPayable } from "./pages/ListInstallmentsAccountPayable/ListInstallmentsAccountPayable";
import { AccountsPayableProvider } from "./contexts/AccountsPayableContext";

export default function App() {
  return (
    <AccountsPayableProvider>
      <MantineProvider theme={theme}>
        <Notifications />
        <HeaderMegaMenu />
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
