export interface NewFriend {
  friendname: string
  email: string
  gender: string
  age: number
  hobbies: string
  description: string
}

export interface Friend {
  id: number
  friendname: string
  email: string
  gender: string
  age: number
  hobbies: string
  description: string
  userId: number
}

export interface FriendsState {
  friends: {
    data: Friend[]
  }
  friend: {
    data: Friend
  }
  loading: boolean
  updated: boolean
}

export interface FriendsResult {
  data: {
    friends: Friend[]
    message: string
  }
}

export interface FriendResult {
  data: {
    friend: Friend
    message: string
  }
}
