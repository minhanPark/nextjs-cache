# nextjs 캐싱

## 전체경로 캐싱(The Full Route Cache)

nextjs에서 개발모드로 진행할 때는 새로고침을 할 때 새로운 데이터를 계속 받아온다. 하지만 프로덕션 모드에서는 그러지 않을 수 있다.  
왜냐하면 nextjs는 기본적으로 라우트를 static/dynamic으로 나누고 static 일때는 빌드 타임에 정적 html을 생성하여 동일한 컨텐츠를 캐싱해서 제공하기 때문이다.

페이지가 dynamic 라우트인지 static 라우트인지는 개발 시 또는 빌드 시에 알 수 있다. 개발 모드에서 브라우저의 왼쪽 하단을 보면 마크가 있는데 누르면 static인지 dynamic인 지 알 수 있다. 또한 빌드 시에도 빌드 로그에 나온다.

```bash
┌ ○ /                                      135 B         101 kB
└ ○ /_not-found                            978 B         101 kB
+ First Load JS shared by all             100 kB
  ├ chunks/4bd1b696-5b6c0ccbd3c0c9ab.js  53.2 kB
  ├ chunks/684-c131fa2291503b5d.js       45.4 kB
  └ other shared chunks (total)          1.88 kB

○  (Static)  prerendered as static content #해당 표시는 스태틱
```

빌드시에 정적 html로 되는지를 확인하기 위해서는 아래처럼 예시를 만들어보자

```tsx
// src/app/page.tsx

export default function Home() {
  console.log(`Rendering  ${new Date().toLocaleTimeString()}`);
  return (
    <main>
      <div className="">{new Date().toLocaleTimeString()}</div>
    </main>
  );
}
```

개발 모드에서는 새로고침할 때 마다 시간이 달라지는 것을 확인할 수 있다. 그러나 npm run build 후에 npm run start를 하면 새로고침을 해도 시간이 변하지 않는 것을 확인할 수 있다.

### 동적 렌더링으로 변경하기

connection 함수를 사용하면 렌더링을 계속 하기 전에 들어오는 사용자 요청을 기다리도록 지정할 수 있다.

> 컴포넌트가 동적 API를 사용하지 않지만 빌드 시점에 정적으로 렌더링되지 않고 런타임에 동적으로 렌더링되게 만들 떄 사용하면 유용하다.

```tsx
import { connection } from "next/server";

export default async function Home() {
  await connection();
  console.log(`Rendering  ${new Date().toLocaleTimeString()}`);
  return (
    <main>
      <div className="">{new Date().toLocaleTimeString()}</div>
    </main>
  );
}
```

위처럼 connection 함수를 사용하면 개발모드에서 왼쪽 하단을 보면 dynamic으로 표시되는것을 알 수 있다. 또한 빌드시엔 로그가 아래처럼 바뀐다.

```bash
┌ ƒ /                                      135 B         101 kB
└ ○ /_not-found                            978 B         101 kB
+ First Load JS shared by all             100 kB
  ├ chunks/4bd1b696-5b6c0ccbd3c0c9ab.js  53.2 kB
  ├ chunks/684-c131fa2291503b5d.js       45.4 kB
  └ other shared chunks (total)          1.88 kB


○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand # / 페이지가 f로 바뀐 것을 확인할 수 있다.
```

### 추가적으로 변겨할 수 있는 방법

request 객체에 직접적으로 접근을 하면 dynamic 라우트로 변경이 된다.

```tsx
import { cookies, headers } from 'next/headers';

export default async function Home() {
  await headers();
  await cookies();
```

request에 접근하는 함수인 headers나 cookies를 사용하면 빌드시에 동적 라우터로 변경된 것을 확인할 수 있다.

명시적으로는 dynamic설정을 추가할 수 있다.

```tsx
export const dynamic = "force-dynamic";
```

위처럼 dynamic 변수를 추가하면 빌드시에 동적 라우터로 변경된 것을 확인할 수 있다.

## 정적 렌더링

기본적으로는 정적 렌더링을 하면 위에서 봤듯이 시간이 변하진 않는다. 부분적으로 재검증을 통해서 특정 시간마다 아니면 강제적으로 값이 변하도록 할 수 있다.

### 자동 재검증(Automatic Revalidation)

5초마다 업데이트 하게 하려면 revalidate를 추가하면 된다.

```tsx
export const revalidate = 5; // 5초마다 업데이트 됨
```

정적 컨텐츠에 revalidate를 설정해주면 설정된 시간이 지난 후에 다시 데이터를 받아온다.

### 수동으로 재검증(Manually Revalidation)

```tsx
export default async function Home() {
  async function onRevalidateHome() {
    "use server";
    revalidatePath("/");
  }

  console.log(`Rendering  ${new Date().toLocaleTimeString()}`);
  return (
    <main>
      <div className="">{new Date().toLocaleTimeString()}</div>
      <RevalidateButton onRevalidateHome={onRevalidateHome} />
    </main>
  );
}
```

onRevalidateHome 서버액션을 만들고 RevalidateButton에 전달했다.

```tsx
"use client";

export default function RevalidateButton({
  onRevalidateHome,
}: {
  onRevalidateHome: () => Promise<void>;
}) {
  return (
    <button onClick={async () => await onRevalidateHome()} className="mt-4">
      Revalidate Home
    </button>
  );
}
```

RevalidateButton 컴포넌트는 위와 같이 생겼다.  
버튼을 누르면 revalidatePath("/")가 작동이 되고 새로 렌더링이 되는것을 알 수 있다.

## API ROUTE 캐시

이전 버전에서는 GET의 경우 자동으로 캐싱되었다. 하지만 15버전 부터는 GET이라도 자동으로 캐싱되지 않고 빌드 타임에 Dynamic 라우터로 변경된다.

```tsx
// src/app/time/route.ts

import { NextResponse } from "next/server";

export async function GET() {
  console.log(`GET /time ${new Date().toLocaleTimeString()}`);
  return NextResponse.json({ time: new Date().toLocaleTimeString() });
}
```

위와 같이 GET 라우터를 추가해보고 빌드해보면 dynamic 라우터로 되는 것을 확인할 수 있다.
