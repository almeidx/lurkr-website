import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  box-shadow: rgba(3, 8, 20, 0.1) 0px 0.15rem 0.5rem, rgba(2, 8, 20, 0.1) 0px 0.075rem 0.175rem;
  height: 100%;
  width: 100%;
  border-radius: 4px;
  transition: all 500ms;
  overflow: hidden;

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  border: 1px solid var(--gray);

  &:hover {
    box-shadow: rgba(2, 8, 20, 0.1) 0px 0.35em 1.175em, rgba(2, 8, 20, 0.08) 0px 0.175em 0.5em;
    transform: translateY(-3px) scale(1.1);
  }
`;

export const NavContainer = styled.nav`
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

export const GuildIcon = styled.img`
  display: flex;
`;

export const JoinButton = styled.button`
  background-color: green;

  display: flex;
  align-items: center;
  justify-content: left;

  padding-bottom: 2px;
  padding-left: 2px;
`;
