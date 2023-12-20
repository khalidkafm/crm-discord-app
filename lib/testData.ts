import {Invite} from '@/models/invites';
import mongoose from 'mongoose';
import "../models/connection";
/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */
export async function findOneInvite(req: any, res: any) {
  try {
    

    console.log('CREATING DOCUMENT');
    const test = await Invite.findOne({code: '657c8793f08cb9a86c3491f7'});
    console.log('CREATED DOCUMENT', test);

    res.json({ test });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
}