import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminLayout from './_components/layout/AdminLayout'

export default function AdminTemplate() {
    return (
        <AdminLayout>
            <Outlet />
        </AdminLayout>
    )
}
