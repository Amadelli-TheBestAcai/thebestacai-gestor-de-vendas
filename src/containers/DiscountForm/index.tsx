import React, { useState, useEffect } from "react";
import { useSale } from "../../hooks/useSale";

import { message, notification } from "antd";

import {
  Container,
  InputMask,
  Footer,
  ButtonCancel,
  ButtonSave,
  Select,
  Option,
  Input,
  InputSearchReward,
  RewardSearch,
  IconContainer,
  SearchIcon,
  Spin,
  RewardList,
  RewardRow,
} from "./styles";

const DiscountForm: React.FC = () => {
  const {
    discountModalState,
    onAddDiscount,
    discountModalHandler,
    sale,
    setSale,
  } = useSale();
  const [userCpf, setUserCpf] = useState("");
  const [rewards, setRewards] = useState<
    {
      id: number;
      description: string;
      value: number;
      product_id: number;
      is_taked: boolean;
      refused: boolean;
    }[]
  >([]);
  const [searchingReward, setSearchingReward] = useState(false);
  const [value, setValue] = useState<number>();
  const [discountType, setDiscountType] = useState(1);

  useEffect(() => {
    if (!sale.customer_nps_reward_id) {
      setUserCpf("");
      setRewards([]);
    }
  }, [sale]);

  const handleSubmit = () => {
    if (value < 0 || (discountType === 2 && value > 100)) {
      return message.warning("Informe um valor válido");
    }
    discountModalHandler.closeDiscoundModal();
    setValue(0);
    setDiscountType(1);
    onAddDiscount(value);
    document.getElementById("mainContainer").focus();
  };

  const getAmount = (amount: number): void => {
    if (discountType === 2) {
      setValue(sale.total_sold * (amount / 100));
    } else {
      setValue(amount);
    }
  };

  const handleSelect = (type: number) => {
    setValue(0);
    setDiscountType(type);
  };

  const discountTypes = [
    {
      id: 1,
      value: "Unitário",
    },
    {
      id: 2,
      value: "Percentual",
    },
  ];

  const getCampaignReward = async () => {
    if (userCpf.length != 11) {
      return notification.error({
        message: "O CPF do usuário deve conter 11 digitos",
        duration: 5,
      });
    }
    setSearchingReward(true);
    const { has_internal_error, error_message, response } =
      await window.Main.sale.getCampaignReward(userCpf);

    if (has_internal_error) {
      setSearchingReward(false);

      setRewards([]);

      return notification.error({
        message: error_message || "Erro ao buscar recompensas",
        duration: 5,
      });
    }

    setRewards(response);
    setSearchingReward(false);
  };

  const useReward = async (reward: {
    id: number;
    product_id: number;
    description: string;
    value: number;
    is_taked: boolean;
  }) => {
    const total_paid = sale.payments.reduce(
      (total, payment) => total + payment.amount,
      0
    );

    const { response: product, has_internal_error: errorOnProduct } =
      await window.Main.product.getIdProducts(reward.product_id);

    const { response: updatedSale, has_internal_error: errorOnAddItem } =
      await window.Main.sale.addItem(product, 1, 0);

    if (!sale.items.length) {
      return notification.warning({
        message: "Não é possível aplicar este desconto",
        description: `Adicione produtos para aplicar desconto`,
        duration: 5,
      });
    }

    if (value > sale.total_sold) {
      return notification.warning({
        message: "Não é possível aplicar este desconto",
        description: `Desconto não deve ser maior que o valor total dos produtos.`,
        duration: 5,
      });
    }

    if (
      sale.total_sold === total_paid ||
      value > sale.total_sold - total_paid
    ) {
      return notification.warning({
        message: "Não é possível aplicar este desconto",
        description: `Retire todos os pagamentos para adicionar desconto.`,
        duration: 5,
      });
    }

    setSale({
      ...sale,
      customer_nps_reward_id: reward.id,
      customer_nps_reward_discount: reward.value,
    });

    await window.Main.sale.updateSale(sale.id, {
      ...sale,
      customer_nps_reward_id: reward.id,
      customer_nps_reward_discount: reward.value,
    });

    discountModalHandler.closeDiscoundModal();
    document.getElementById("mainContainer").focus();
  };

  return (
    <Container
      title="Desconto"
      visible={discountModalState}
      onOk={handleSubmit}
      closable={true}
      onCancel={() => {
        document.getElementById("mainContainer").focus();
        discountModalHandler.closeDiscoundModal();
      }}
      destroyOnClose={true}
      centered
      width={400}
      footer={
        <Footer>
          <ButtonCancel
            onClick={() => discountModalHandler.closeDiscoundModal()}
          >
            Cancelar
          </ButtonCancel>
          <ButtonSave onClick={() => handleSubmit()}>
            {userCpf ? 'Resgatar recompensa' : 'Aplicar desconto'}
          </ButtonSave>
        </Footer>
      }
    >
      <>
        <RewardSearch>
          <InputSearchReward
            placeholder="Procurar recompensa por cpf"
            value={userCpf}
            onChange={({ target: { value } }) => setUserCpf(value)}
          />
          <IconContainer onClick={getCampaignReward}>
            {searchingReward ? <Spin /> : <SearchIcon />}
          </IconContainer>
        </RewardSearch>
        <RewardList>
          {rewards.map((reward) => (
            <RewardRow key={reward.id}>
              <span>{reward.description}</span>
              {<div
                style={{ color: "#52c41a" }}
                onClick={() => useReward(reward)}
              >
                Resgatar
              </div>}
            </RewardRow>
          ))}
        </RewardList>
      </>
      <>
        <Select
          onChange={(type) => handleSelect(+type)}
          placeholder="Escolha a opção"
          defaultValue={"Unitário"}
        >
          {discountTypes.map((item) => (
            <Option key={item.id}>{item.value}</Option>
          ))}
        </Select>
      </>
      {discountType === 1 ? (
        <>
          <InputMask
            autoFocus={true}
            getValue={getAmount}
            onEnterPress={handleSubmit}
          />
        </>
      ) : (
        <>
          <Input
            autoFocus={true}
            placeholder="percentual (%)"
            onPressEnter={handleSubmit}
            onChange={({ target: { value } }) => getAmount(+value)}
            type="number"
          />
        </>
      )}
    </Container>
  );
};

export default DiscountForm;
