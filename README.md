# Flack Frontend

<p align="center">
  <a href="https://flack.exchange">
      <img src="https://tokens-flack.netlify.app//images/symbol/flack.png" height="128">
  </a>
</p>

This project contains the main features of the Flack application.

If you want to contribute, please refer to the [contributing guidelines](./CONTRIBUTING.md) of this project.

## Documentation

- [Info](doc/Info.md)
- [Cypress tests](doc/Cypress.md)

> Install dependencies using [pnpm](https://pnpm.io)

## `apps/web`
<details>
<summary>
How to start
</summary>

```sh
pnpm i
```

start the development server
```sh
pnpm dev
```

build with production mode
```sh
pnpm build

# start the application after build
pnpm start
```
</details>

## `apps/aptos`
<details>
<summary>
How to start
</summary>

```sh
pnpm dev:aptos
```
```sh
pnpm build:aptos
```
</details>

## `apps/blog`
<details>
<summary>
How to start
</summary>

```sh
pnpm dev:blog
```
```sh
pnpm build:blog
```
</details>


## Packages

| Package                                                       | Description                                                                                                            |
|---------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------|
| [sdk](/packages/swap-sdk)                                     | An SDK for building applications on top of Flack                                                                 |
| [swap-sdk-core](/packages/swap-sdk-core)                      | Swap SDK Shared code                                                                                                   |
| [wagmi](/packages/wagmi)                                      | Extension for [wagmi](https://github.com/wagmi-dev/wagmi), including bsc chain and binance wallet connector            |
| [awgmi](/packages/awgmi)                                      | Connect to Aptos with similar wagmi React hooks.                                                                       |

