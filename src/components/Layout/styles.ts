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
    font-size: 30px;
  }
`;

export const NavBar = styled.nav`
  height: 50px;
  width: 100%;
  color: var(--white);

  display: flex;
  align-items: center;
  justify-content: left;

  font-size: 20px;

  > img {
    width: 50px;
    height: auto;

    border-radius: 25%;

    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE10+ / Edge */
    user-select: none; /* Standard */

    -webkit-user-drag: none;
  }

  > span {
    font-size: 20px;
    padding-left: 5px;
  }
`;

export const GridSection = styled.section`
  display: grid;
  gap: 1rem;

  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
`;
