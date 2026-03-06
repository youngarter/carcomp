import CarsAdmin from "./CarsAdmin";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminCarsPage() {
    const session = await auth();

    if (!session?.user || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
        redirect("/");
    }

    return <CarsAdmin />;
}
