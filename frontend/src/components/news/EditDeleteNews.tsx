import {useLocation} from 'react-router-dom';
import EditNews from './EditNews.tsx';
import DeleteNews from './DeleteNews.tsx';
import AdminNav from "../structural_components/AdminNav.tsx";

export default function EditDeleteNews() {
    const location = useLocation();

    return (
        <div data-bs-theme="dark">
            <AdminNav />

            <h4>{location.pathname === '/deletenews' ? 'Delete News Selection' : 'Edit News Selection'}</h4>
            {location.pathname === '/deletenews' ? <DeleteNews /> : <EditNews />}
        </div>
    );
};