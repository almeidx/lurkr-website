import Error from '../components/Error';

export default function _404() {
  return <Error message="This page does not exist." statusCode={404} />;
}
