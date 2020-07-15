import styled from 'styled-components';

export const Container = styled.div`
  background: var(--background);
`;

export const Wrapper = styled.div`
  height: 100%;
  max-width: 601px;
  margin: 0 auto;

  display: flex;
  justify-content: center;

  > span {
    font-size: 25px;
  }
`;

export const NavBar = styled.nav`
  height: 50px;
  width: 100%;
  color: var(--white);

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 20px;
`;
