import { Alert } from 'react-native';
import { handleLeave, handleGroupDelete } from '../component/IndivGroupPage';
import {sendUser} from '../Data/sendUser'
import {deleteGroup} from '../Data/deleteGroup'

jest.spyOn(Alert, 'alert').mockImplementation(() => {});

  jest.mock('../Data/sendUser', () => ({
    sendUser: jest.fn(),
  }));

  jest.mock('../Data/deleteGroup', () => ({
      deleteGroup: jest.fn(),
  }));

  const navigation = {
    reset: jest.fn(),
  };

   const gp = { _id: 'group123' };
   const own = { _id: 'user123' };
   const own2 = { _id: 'member1' };
   const Admins = [{ _id: 'member1', name: 'member1', }, { _id: 'member2', name: 'member2', }, { _id: 'member3', name: 'member3',},];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('handleLeave calls sendUser properly (admin ver)', async () => {
    await handleLeave(gp, own2, Admins, navigation);

    expect(sendUser).toHaveBeenCalledWith(
      'admins',
      'group123',
      {
        id: 'group123',
        userId: 'member1',
        deletedAdmins: ['member1'],
      },
      'delete'
    );
  });

  test('handleLeave calls sendUser properly (members ver)', async () => {
      await handleLeave(gp, own, Admins, navigation);

      expect(sendUser).toHaveBeenCalledWith(
        'members',
        'group123',
        {
          id: 'group123',
          userId: 'member1',
          deletedMembers: ['user123'],
        },
        'delete'
      );
    });

  test('handleGroupDelete calls deleteGroup properly', async () => {
      await handleGroupDelete(gp, own, navigation);

      expect(deleteGroup).toHaveBeenCalledWith(
      'group123',
      {
      Groupid: 'group123',
      userId: 'user123',
      });
   });