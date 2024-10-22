import { Modal, Center, SegmentedControl } from "@mantine/core";
import {
  IconCircleDashedPercentage,
  IconCirclePercentage,
} from "@tabler/icons-react";
import { NewDebtModalProps } from "./types/NewDebtModal";
import { FormSimpleInterest } from "./FormSimpleInterest";
import { TypesOfInterest } from "./enums/TypesOfInterest";
import { useState } from "react";

export const NewDebtModal = ({ opened, close }: NewDebtModalProps) => {
  const [segmented, setSegmented] = useState<string>(TypesOfInterest.SIMPLE);

  return (
    <Modal
      opened={opened}
      onClose={close}
      title="NOVA DÍVIDA"
      size="lg"
      centered
    >
      <SegmentedControl
        fullWidth
        value={segmented}
        onChange={setSegmented}
        data={[
          {
            value: TypesOfInterest.SIMPLE,
            label: (
              <Center style={{ gap: 10 }}>
                <IconCirclePercentage />
                <span>Juro Simples</span>
              </Center>
            ),
          },
          {
            value: TypesOfInterest.COMPOSITE,
            label: (
              <Center style={{ gap: 10 }}>
                <IconCircleDashedPercentage />
                <span>Juro Composto</span>
              </Center>
            ),
          },
        ]}
      />

      {segmented == TypesOfInterest.SIMPLE && (
        <FormSimpleInterest type={segmented} close={close} />
      )}
    </Modal>
  );
};
