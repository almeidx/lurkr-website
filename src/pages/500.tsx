import Error from "../components/Error";

export default function _500() {
	return <Error code={500} message="Internal Server Error." title="Interval Server Error" />;
}
