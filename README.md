# NextJS로 BLOG만들어보기

해당 프로젝트는 `.md`파일을 파싱하여 markdown과 frontmatter값을 바탕으로 게시글을 만드는 프로젝트입니다.

```markdown
---
categories:
  - Development
  - VIM
date: "2012-04-06"
description: 설명을 적는 곳입니다
slug: spf13-vim-3-0-release-and-new-website
tags:
  - .vimrc
  - plugins
  - spf13-vim
  - vim
title: hello
---

## 예시입니다

- 예시입니다
```

주어진 예제는 위와 같으며, `---` ~ `---` 사이의 값은 frontmatter 포스트의 상세 페이지를 통해 확인이 가능하며, 그외의 데이터는 markdown값으로 이를 바탕으로 페이지를 구성해야한다.

## 사용 기술

- Next : 13.4.9
- tailwindCSS
- remark: ^14.0.3
- remark-gfm: ^3.0.1
- remark-html: ^15.0.2
- gray-matter: ^4.0.3
- yarn

## 구현사항

- ### index.tsx

Home 페이지로, `getServerSideProps`를 통해 데이터를 동적으로 받아서 이를 컴포넌트의 props로 전달
이때 `getPosts()`를 통해 `__posts` 폴더에 `.md`파일에 접근하여 title, description, date의 메타데이터와 파일명을 받아온다.
이후 이를 `PostsList`컴포넌트에 전달

```tsx
export const getServerSideProps: GetServerSideProps = async () => {
  const data = await getPosts();

  return {
    props: {
      posts: data,
    },
  };
};
```

- ### PostsList.tsx

받은 데이터를 각각의 카드 형태로 보여주는 컴포넌트입니다.
`useRouter`를 사용하여 게시글을 클릭한다면 해당 글에 대한 상세페이지로 넘어가게 됩니다.
다이나믹 라우팅을 위한 아이디 값으로 path(파일명) 전달

```tsx
const movePost = useCallback(
  (path: string) => {
    router.push(path);
  },
  [router]
);
```

- ### [id].tsx

`data`는 메타데이터가 담겨 있으므로 `<Head>`태그에 넣어 설정해준 후 마크다운 파일을 Html태그로 변환한 문자열이 담겨있는 `content`의 경우에는 `dangerouslySetInnerHTML`를 통해 리액트 컴포넌트에 추가

```tsx
function Page({ content, data }) {
  const createMarkdown = useCallback(() => {
    return { __html: content };
  }, [content]);

  return (
    <>
      <Head>
        <title>{data.title}</title>
        <meta name="description" content={data.description} />
        <meta name="keywords" content={data.tags.join(", ")} />
        <meta property="og:title" content={data.title} />
        <meta property="og:description" content={data.description} />
        <meta property="og:url" content={`https://example.com/${data.slug}`} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={data.date} />
        <meta property="article:section" content={data.categories.join(", ")} />
      </Head>
      <Layout>
        <div dangerouslySetInnerHTML={createMarkdown()} />
      </Layout>
    </>
  );
}
```

`getStaticProps`와 `getStaticPath`를 통해 정적으로 생성해 놓을 페이지 구성
`getStaticProps`의 `getPost(context.params.id)`를 통해 특정 `params`의 페이지 정보 전달
`getStaticPath`의 `getPostParams()` 통해 정적으로 생성할 페이지 `params` 설정, 만약 지정하지 않은 `params`가 들어올 경우 `fallback:false`를 통해 404페이지로 이동하게 된다.

```tsx
export const getStaticProps: GetStaticProps = async (context) => {
  const { content, data } = await getPost(context.params.id);

  return {
    props: {
      content,
      data,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async (context) => {
  const data = await getPostParams();

  return {
    paths: data,
    fallback: false,
  };
};
```

- ### getPost.ts / getPosts.ts

`getPosts.ts`의 경우에는 메타데이터를 추출하기 위한 파일이며, `getPost.ts` 파일의 경우에는 메타데이터와 마크다운 파일을 html태그로 바꾼 후 이를 문자열로 변환하기 위한 파일이다. 과정은 거의 똑같다.

`gray-matter`를 통해 메타데이터와 마크다운 파일을 분리하게 되면 마크다운으로 작성된 값은 content에 저장되며, 메타데이터 값은 data에 저장되게 된다.

그럼 저장된 마크다운 파일을 `remark`라이브러리와 연관된 플러그인을 통해 Html 태그로 이루어진 문자열로 변환해주면 된다.

```tsx
const { content, data } = matter(postFile);
const remarkContent = await remark().use(remarkHtml).use(remarkGfm).process(content);
```

테이블의 경우에는 `remarkHtml`로 변환되지 않는것 같아 추가적인 플러그인(`remark-gfm`)을 설치하여 변환해주었다.

- ### 404.tsx

잘못된 params을 입력했을 때 404페이지가 보여준 후 강제로 Root(`/`)페이지로 이동시켜준다.

```tsx
const router = useRouter();
useEffect(() => {
  const moveListPage = setTimeout(() => {
    router.push("/");
  }, 1000);
  return () => clearTimeout(moveListPage);
}, [router]);
```

## 보완해야할 점

- #### router.push('/') => roter.replace('/')

잘못된 params로 이동할 경우 404페이지가 보여준 후 Root페이지로 이동하게 되는데 `router.push`로 할 경우 사용자가 뒤로가기 버튼을 누르면 다시 404페이지로 다시 갈 수 있게 된다.
이를 방지하기 위해 `router.replace`로 구현을 하게 되면 사용자가 404페이지로 간 후 루트페이지로 강제로 이동하게 되면 그때 탭창에 잘못된 params의 값이 변하지 않고 그대로 남게 된다.

- #### \_\_posts 폴더가 비어있을 경우

\_\_posts 폴더가 비어있는 경우에는 `getServerSideProps`의 경우에는 오류없이 동작을 하게 되지만 `getStaticProps`와 `getStaticPath`에서 오류가 발생한다.
이에 대해 수정을 추가적으로 해줘야 한다.

- #### 리펙토링

PostsLists에서 각각의 Post를 보여주기 위해서 컴포넌트를 생성해 주었지만 실수로 사용을 하지 못했다.
`getPosts`와 `getPost`의 파일에 동일한 기능을 하거나 유사한 기능을 하는 함수가 중복되서 작성되었다.
`remark-html`에서 빨간줄(경고)이 뜨게되는데, 아마도 타입에 대한 경고인 것 같다.
