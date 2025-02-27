import styled from 'styled-components';

export const Container = styled.div`
  padding: 80px 60px;
  background: radial-gradient(circle, rgba(220, 223, 229, 1) 0%, rgba(209, 213, 219, 1) 100%);

  @media (max-width: 1000px) {
    padding: 70px 30px;
  }
`;

export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 1000px;
    margin: 0 auto;
    /* background: red; */
`

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Align items to the left */
  text-align: left; /* Ensure text inside is left-aligned */
  margin-left: 60px;
`;


export const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  grid-gap: 20px;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
`;

export const Link = styled.a`
  color: #000;
  margin-bottom: 20px;
  font-size: 18px;
  text-decoration: none;
  display: inline-block; /* Ensures transform works properly */
  text-align: left; /* Align text to the left */

  &:hover {
      color: #606060;
      transform: scale(1.2) translateX(10px); /* Scale and shift right */
      transition: 70ms ease-in-out;
  }
`;



export const Title = styled.p`
  font-size: 24px;
  color: #3a3a3a;
  margin-bottom: 40px;
  font-weight: bold;
  text-align: left; /* Align text to the left */
  display: flex;
  justify-content: flex-start; /* Keep content aligned to the left */
  width: 100%;
`;
 