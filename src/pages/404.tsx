import Error from "../components/Error";

export default function _404() {
	return <Error code={404} message="This page could not be found." title="Page Not Found" />;
}
