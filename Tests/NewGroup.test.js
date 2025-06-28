import { Alert } from 'react-native';
import { handleAdding } from '../component/NewGroup';
import {sendGroup} from '../Data/sendGroup'

jest.spyOn(Alert, 'alert').mockImplementation(() => {});

  jest.mock('../Data/sendGroup', () => ({
    sendGroup: jest.fn(),
  }));

  const navigation = {
    reset: jest.fn(),
  };

   const groupName = "Test";
   const myuser = { _id: 'user123' };
   const selectedUsers = [{ _id: 'member1', name: 'member1', }, { _id: 'member2', name: 'member2', }, { _id: 'member3', name: 'member3',},];
   const groupDesc = "desc";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('handleAdding calls sendGroup properly', async () => {
    await handleAdding(groupName, myuser, selectedUsers, groupDesc, navigation);

    expect(sendGroup).toHaveBeenCalledWith(
      {
         name: "Test",
         admins: ['user123'],
         members: ['member1', 'member2', 'member3'],
         description: "desc",
      },
    );
  });