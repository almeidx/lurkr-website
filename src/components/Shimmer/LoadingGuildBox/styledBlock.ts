import styled from 'styled-components';

export default styled.div`
  display: block!important;
  width: 280px;
  height: 90px;

  & + & {
    margin-top: 5px;
  }
`;
