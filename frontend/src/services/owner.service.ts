import config from '../utils/config';
import authService from './auth.service';
import { Owner } from '../models/Owner';
import { parseISO } from 'date-fns';


const getOwner = async (id: string) => {

    return await fetch(`${config.apiEndpoint}/api/owners/${id}`, {
        method: 'GET',
        headers: { ...authService.authHeader(), 'Content-Type': 'application/json' }
    })
        .then(response => {
            return response.json();
        })
        .then((d: any) => ({
            id: d.id,
            address: d.address,
            fullName: d.fullName,
            birthDate: d.birthDate ? parseISO(d.birthDate) : undefined,
            email: d.email,
            phone: d.phone
        } as Owner))
};

const ownerService = {
    getOwner,
};

export default ownerService;
