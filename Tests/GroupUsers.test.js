import { Alert } from 'react-native';
import { handleDelete, handleAdminAdding, handleAdminDeleting } from '../component/GroupUsers';
import {sendUser} from '../Data/sendUser'

jest.spyOn(Alert, 'alert').mockImplementation(() => {});

  jest.mock('../Data/sendUser', () => ({
    sendUser: jest.fn(),
  }));

  const navigation = {
    pop: jest.fn(),
  };

   const Group = { _id: 'group123' };
   const user = { _id: 'user123' };
   const Member = { _id: 'member456' };
   const Admin = { _id: 'admin789' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('handleDelete calls sendUser properly', async () => {
    await handleDelete(navigation, user, Group._id, Member);

    expect(sendUser).toHaveBeenCalledWith(
      'members',
      'group123',
      {
        id: 'group123',
        userId: 'user123',
        deletedMembers: ['member456'],
      },
      'delete'
    );
  });

  test('handleAdminAdding calls sendUser properly', async () => {
      await handleAdminAdding(navigation, user, Group._id, Member);

      expect(sendUser).toHaveBeenCalledWith(
        'members',
        'group123',
        {
          id: 'group123',
          userId: 'user123',
          promotedMembers: ['member456'],
        },
        'promote'
      );
    });

  test('handleAdminDeleting calls sendUser properly', async () => {
        await handleAdminDeleting(navigation, user, Group._id, Member);

        expect(sendUser).toHaveBeenCalledWith(
          'admins',
          'group123',
          {
          id: 'group123',
          userId: 'user123',
          demotedAdmins: ['member456'],
          },
          'demote'
        );
      });

