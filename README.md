# LUCE 동네 거리뷰

이미지 6장과 배치도·위성뷰를 연결한 정적 웹 레퍼런스입니다. 실제 360도 파노라마가 아닙니다.

`dist/index.html`을 직접 열거나, 이 폴더에서 `node preview.mjs`를 실행하고 `http://127.0.0.1:4173`에 접속합니다.

- 지도 및 장소 목록에서 지점 선택, 연결된 골목으로 이동
- 휠·버튼·핀치 확대, 확대 후 드래그, 더블 클릭 확대/초기화
- 배치도 및 수직 위성뷰, 이미지 원본 저장, 현재 지점 링크 복사
- 모바일 장소 검색 및 가로 썸네일 목록
- 키보드: ←/→ 이동, +/- 확대/축소, 0 초기화, / 검색

원본: `output/streetview-references-v2`. 건물 위치와 동선은 배치도 기준이며, 거리 이미지 사이 세부 외관은 다를 수 있습니다. 경찰서와 뼈해장국은 배치도에만 표시됩니다.

## GitHub Pages

`.github/workflows/pages.yml`이 `main` 브랜치에 푸시할 때 `dist/`를 배포합니다. 저장소의 Settings → Pages → Build and deployment → Source를 **GitHub Actions**로 선택합니다.

모든 이미지·스타일·스크립트 경로는 상대 경로이므로 프로젝트별 GitHub Pages 주소에서도 작동합니다. `.openai/`는 로컬의 기존 Sites 설정이며 GitHub 업로드 대상에서 제외됩니다.
