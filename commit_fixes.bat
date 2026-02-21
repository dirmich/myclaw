chcp 65001
git add .
echo 로그 정규화 및 설치 안정화 로직 추가 > commit_msg.txt
echo. >> commit_msg.txt
echo 1. 터미널 로그의 ANSI 탈출 문자를 제거하여 텍스트가 깨져 보이는 현상을 해결했습니다. >> commit_msg.txt
echo 2. React useEffect의 중복 실행으로 인해 로그가 두 번씩 출력되던 문제를 수정했습니다. >> commit_msg.txt
echo 3. 백그라운드에서 실행 중인 APT 프로세스로 인해 설치가 멈추지 않도록 락(Lock) 감지 및 자동 대기 로직을 추가했습니다. >> commit_msg.txt
git commit -F commit_msg.txt
git push
del commit_msg.txt
