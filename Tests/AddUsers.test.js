import { Alert } from 'react-native';
import { handleAdding } from '../component/AddUsers';
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
   const Member = [{ _id: 'member1', name: 'member1', }, { _id: 'member2', name: 'member2', }, { _id: 'member3', name: 'member3',},];
   const Admin = { _id: 'admin789' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('handleAdding calls sendUser properly', async () => {
    await handleAdding(navigation, Group, user, Member);

    expect(sendUser).toHaveBeenCalledWith(
      'members',
      'group123',
      {
        id: 'group123',
        userId: 'user123',
        addedMembers: ['member1', 'member2', 'member3'],
      },
      'add'
    );
  });