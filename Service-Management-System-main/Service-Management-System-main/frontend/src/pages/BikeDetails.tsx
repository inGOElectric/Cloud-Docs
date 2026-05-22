import { useParams } from "react-router-dom";

import FleelowspeedDetails from "../bike-pages/FleelowspeedDetails";
import FleehighspeedDetails from "../bike-pages/FleehighspeedDetails";


export default function BikeDetails() {

const { id } = useParams();

if (id === "1") return <FleelowspeedDetails />;
if (id === "2") return <FleehighspeedDetails />;

return (
<div className="p-10 text-center">
Bike not found
</div>
);

}