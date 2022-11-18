import Layout from "../Components/Layout"
import PhotosCard from "./Partials/Dashboard/PhotosCard";
import useAuth from "../Providers/AuthProvider";

export default function Dashboard() {
    const { loading, user } = useAuth()

    if (!loading && user) {
        return (
            <Layout pageTitle="Dashboard">
                <PhotosCard/>
            </Layout>
        )
    }

    return (
        <></>
    )
}
