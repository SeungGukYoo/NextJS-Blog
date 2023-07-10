---
categories:
  - Development
  - VIM
date: "2012-04-06"
description: React-router-dom을 사용하지 않고 직접 구현
slug: spf13-vim-3-0-release-and-new-website
tags:
  - .vimrc
  - plugins
  - spf13-vim
  - vim
title: React Self SPA
---

# React와 History API 사용하여 SPA Router 기능 구현하기

리액트로 개발하기 위해서는 다른 필수적인 라이브러리를 설치하여 사용하는 경우가 많다.
그중 대표적으로 React-router는 모든 프로젝트에 필수적으로 사용되어지는데 이번 원티드를 통해서 React-router를 설치하지 않고 직접 구현해보고자 한다.

## React-router

React-router는 페이지간 이동시에 사용되는 라이브러리로 path의 경로에 따라 일치하는 경로의 페이지를 보여주는 라이브러리이다.

- `/` → `root` 페이지
- `/about` → `about` 페이지

React-router의 메인 컨셉은 아래와 같다.

1. History stack을 관찰하고, 조작을 한다.
2. URL과 routes들을 비교한다.
3. 일치하는 route를 렌더링한다.

이를 바탕으로 window API를 사용해서 구현을 해보고자 한다.

## 조건

### 1. 최종적으로 아래의 형태로 구현되어야 한다.

```tsx
ReactDOM.createRoot(container).render(
  <Router>
    <Route path="/" component={<Root />} />
    <Route path="/about" component={<About />} />
  </Router>
);
```

### 2. 버튼을 클릭하거나, 뒤로가기 버튼을 눌렀을 때 페이지 이동이 이루어져야 한다.

### 3. `push`기능을 가진 useRouter Hook을 작성해야 한다.

```ts
const { push } = useRouter();
```

### 4. 아래의 스크린 샷처럼 동작해야 한다.

- Root 경로

![img](https://lean-mahogany-686.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fd2a19c69-ed92-4431-afca-156a3d8ccd7e%2FUntitled.png?id=5526a31c-b3c7-4fb8-9b66-cf510264e1ac&table=block&spaceId=7ac0bf59-e3bb-4f76-a93b-27f040ec55b6&width=2000&userId=&cache=v2)

- About 경로

![img](https://lean-mahogany-686.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fa10c03a3-1d27-4a02-a495-c7f98775ca23%2FUntitled.png?id=c3f5bcfe-e485-467f-8cd8-b97168c25c1d&table=block&spaceId=7ac0bf59-e3bb-4f76-a93b-27f040ec55b6&width=2000&userId=&cache=v2)

## 구현

- #### main.tsx

```tsx
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Router>
    <Route path="/" component={<App />} />
    <Route path="/about" component={<About />} />
  </Router>
);
```

먼저 최상위 컴포넌트인 `main.tsx`에 위와 같은 형태로 제작을 하며 시작하였다.

- #### Router.tsx

```tsx
type Props = {
  children: React.ReactNode;
};

function Router({ children }: Props) {
  return <div>{children}</div>;
}

export default Router;
```

`React-router-dom` 라이브러리에서 `Router`의 기능은 `children`에 들어오는 요소중 routing API 기능들을 사용할 수 있게 도와주는 `Context`역할을 해주게 된다.  
하지만 나의 경우에는 단순히 컴포넌트 형태를 일치시키기 위해 제작한 것으로, 추가적인 기능은 구현하지 않은 상태이다.

- #### Route.tsx

```tsx
import React, { useEffect, useState } from "react";

type Props = {
  path: string;
  component: React.ReactNode;
};

function Route({ path, component }: Props) {
  const [state, setState] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setState(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return state === path && component;
}

export default Route;
```

`Route` 컴포넌트는 `props`로 받은 값을 전달받은 값을 현재 URL(path)경로와 비교하여 경로가 일치한 컴포넌트만 보여주게 된다.
여기서 `popstate` 이벤트의 경우에는 `history stack`의 변화가 있을 때 동작하여 이전 페이지 혹은 다음 페이지를 보여주게 된다.
그렇기 때문에 처음 실행했을 때의 `pathname`의 값이 `'/'` 루트 경로(이전페이지 혹은 다음페이지로 이동하지 않았기때문)이기 때문에 이벤트는 실행되지 않고 유지되게 된다.

#### **React에서 window에 직접 접근하여 이벤트를 실행시키는 경우 꼭 클린업 함수를 통해 이벤트를 제거해줘야 메모리 누수가 발생하지 않는다.**

- ### App.tsx, About.tsx

```tsx
// App.tsx
import useRouter from "./util/customHook";

function App() {
  const { push } = useRouter();
  return (
    <div>
      <h1>root</h1>
      <button onClick={() => push("/about")}>about</button>
    </div>
  );
}

export default App;
// About.tsx
import useRouter from "../util/customHook";

function About() {
  const { push } = useRouter();

  return (
    <div>
      <h1>about</h1>
      <button onClick={() => push("/")}>go home</button>
    </div>
  );
}

export default About;
```

위 두개 컴포넌트의 구조는 동일하며 버튼을 클릭시에 이동해야 하는 경로를 `useRouter`(커스텀 훅)에서 제공하는 `push`함수에 전달하는 역할만 한다.

- ### customHook.ts

```ts
export default function useRouter() {
  const push = (path: string) => {
    window.history.pushState(null, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };
  return { push };
}
```

`window.history.pushState` 함수에 `path`를 전달하여 함수를 실행시키게 된다.
그럼 `History stack`의 값이 바뀌게 되는데, 이를 확인하고 싶다면 `window.location.pathname`을 해보면 전달한 경로로 새롭게 바뀐것을 알 수 있다.

**하지만 이렇게 작성하고 `Route.tsx`에서 작성했던 `popstate`이벤트가 동작하게 코드를 작성했지만 리렌더링이 되지 않았다. **
**(물론 위 코드는 수정한 코드입니다.) **

코드를 수정하기전 나의 생각은 아래와 같았다.

1. `useState`로 현재 `pathname`의 값을 기억하고 `useEffect`를 통해 의존성 배열에 `state`를 추가해 `state`를 추적
   Ex) 현재 state = '/'
2. `setState`를 통해 `state`값을 변경하면 `state`값이 변경되어 `useEffect`가 실행되어 `window.addEventListener(popstate,()=>{})`실행 후 클린업
   Ex) 변경 후 state = '/about'
3. 리렌더링이 되며 변경된 `state`와 `path`를 다시 비교하며 일치하는 컴포넌트를 렌더링해서 보여줌

하지만 이렇게 작성하니 `History stack`에는 변경이 있지만 리렌더링이 되지 않았으며, `popstate`이벤트가 실행되지 않았다.
그래서 MDN의 `popstate` 문서를 읽어보게 되었고 안됬던 이유를 찾게되었다.

> Note that just calling `history.pushState()` or `history.replaceState()` won't trigger a `popstate` event. The `popstate` event will be triggered by doing a browser action such as a click on the back or forward button (or calling `history.back()` or `history.forward()` in JavaScript).
>
> `history.pushState()`로 `history stack`을 변경해도 `popstate`는 **자동으로 **실행되지 않는다. `popstate`는 이전 페이지 버튼, 다음 페이지 등 브라우저 동작으로만 실행시킬 수 있다.

위의 말은 `window.addEventListener('popstate',()=>{})`가 자동으로 동작하지 않는 것이라는 뜻으로 생각했고, 이벤트를 수동으로 실행시키기 위해서 `window.dispatchEvent`라는 이벤트를 알게되었다. 해당 메서드를 통해 `popstate`를 실행시켜보고자 하였다.

그래서 `window.dispatchEvent(new PopStateEvent("popstate"));`를 작성하여 수동으로 `popstate`를 실행시키는 코드를 작성한 것이다.
