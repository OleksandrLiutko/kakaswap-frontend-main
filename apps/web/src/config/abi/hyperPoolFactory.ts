export const hyperPoolFactoryABI = [
  {
    inputs: [
      {
        internalType: 'contract IFlackToken',
        name: 'flackToken_',
        type: 'address',
      },
      {
        internalType: 'contract IXFlackToken',
        name: 'xFlackToken_',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'emergencyRecoveryAddress_',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'feeAddress_',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'hyperAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'nftPoolAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'contract IERC20',
        name: 'rewardsToken1',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'contract IERC20',
        name: 'rewardsToken2',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'startTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'endTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'harvestStartTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'depositEndTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'lockDurationReq',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'lockEndReq',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'depositAmountReq',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'whitelist',
            type: 'bool',
          },
          {
            internalType: 'string',
            name: 'description',
            type: 'string',
          },
        ],
        indexed: false,
        internalType: 'struct HyperPool.Settings',
        name: 'settings',
        type: 'tuple',
      },
    ],
    name: 'CreateHyperPool',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'hyperAddress',
        type: 'address',
      },
    ],
    name: 'PublishHyperPool',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'fee',
        type: 'uint256',
      },
    ],
    name: 'SetDefaultFee',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'emergencyRecoveryAddress',
        type: 'address',
      },
    ],
    name: 'SetEmergencyRecoveryAddress',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'exemptedAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'isExempted',
        type: 'bool',
      },
    ],
    name: 'SetExemptedAddress',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'feeAddress',
        type: 'address',
      },
    ],
    name: 'SetFeeAddress',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'SetHyperPoolOwner',
    type: 'event',
  },
  {
    inputs: [],
    name: 'MAX_DEFAULT_FEE',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'nftPoolAddress',
        type: 'address',
      },
      {
        internalType: 'contract IERC20',
        name: 'rewardsToken1',
        type: 'address',
      },
      {
        internalType: 'contract IERC20',
        name: 'rewardsToken2',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'startTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'endTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'harvestStartTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'depositEndTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'lockDurationReq',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'lockEndReq',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'depositAmountReq',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'whitelist',
            type: 'bool',
          },
          {
            internalType: 'string',
            name: 'description',
            type: 'string',
          },
        ],
        internalType: 'struct HyperPool.Settings',
        name: 'settings',
        type: 'tuple',
      },
    ],
    name: 'createHyperPool',
    outputs: [
      {
        internalType: 'address',
        name: 'hyperPool',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'defaultFee',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'flackToken',
    outputs: [
      {
        internalType: 'contract IFlackToken',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'emergencyRecoveryAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'exemptedAddressesLength',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'feeAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'getExemptedAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'nftPoolAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'getNftPoolPublishedHyperPool',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'userAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'getOwnerHyperPool',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'getPublishedHyperPool',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'getHyperPool',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'hyperPoolAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'ownerAddress',
        type: 'address',
      },
    ],
    name: 'getHyperPoolFee',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'checkedAddress',
        type: 'address',
      },
    ],
    name: 'isExemptedAddress',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'nftPoolAddress',
        type: 'address',
      },
    ],
    name: 'nftPoolPublishedHyperPoolsLength',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'userAddress',
        type: 'address',
      },
    ],
    name: 'ownerHyperPoolsLength',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'nftAddress',
        type: 'address',
      },
    ],
    name: 'publishHyperPool',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'publishedHyperPoolsLength',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'hyperPoolsLength',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'xFlackToken',
    outputs: [
      {
        internalType: 'contract IXFlackToken',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'newFee',
        type: 'uint256',
      },
    ],
    name: 'setDefaultFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'emergencyRecoveryAddress_',
        type: 'address',
      },
    ],
    name: 'setEmergencyRecoveryAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'exemptedAddress',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'isExempted',
        type: 'bool',
      },
    ],
    name: 'setExemptedAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'feeAddress_',
        type: 'address',
      },
    ],
    name: 'setFeeAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'setHyperPoolOwner',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
