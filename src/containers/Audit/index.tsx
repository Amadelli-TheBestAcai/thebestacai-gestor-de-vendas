import React from "react";

import { Audit as AuditModel } from "../../models/dtos/audit";

import { Container, ArrowRightIcon, Action, Col } from "./styles";

const Audit: React.FC<AuditModel> = (props) => {
  const {
    created_at,
    new_value,
    old_value,
    user_id,
    field,
    user: { name: author },
  } = props;

  const [date, time] = created_at.split(" ");

  const getAuditType = (): string => {
    if (!+old_value && +new_value > 0) {
      return "Adicionado";
    }

    if (+old_value && +new_value) {
      return "Alterado";
    }
    return "Esgotado";
  };

  return (
    <Container
      oldvalue={+old_value}
      newvalue={+new_value}
      justify="space-between"
    >
      <Col sm={3} xs={24}>
        <Action oldvalue={+old_value} newvalue={+new_value}>
          {getAuditType()}
        </Action>
      </Col>

      <Col sm={5} xs={24}>
        {date} {time}
      </Col>
      <Col sm={5} xs={24}>
        {`[${user_id}] `}
        {author}
      </Col>
      <Col sm={5} xs={24}>
        {field && ` ${field}: `} {+old_value || 0} <ArrowRightIcon />{" "}
        {+new_value || 0}
      </Col>
    </Container>
  );
};

export default Audit;
