@echo off
chcp 65001 >nul
echo pip 업그레이드 중...
python -m pip install --upgrade pip
if errorlevel 1 (
    echo py 로 시도합니다...
    py -m pip install --upgrade pip
)
echo.
echo pygame 설치 중...
python -m pip install pygame
if errorlevel 1 (
    echo py 로 시도합니다...
    py -m pip install pygame
)
if errorlevel 1 (
    echo.
    echo 설치 실패. "설치방법.txt" 를 참고하세요.
    pause
    exit /b 1
)
echo.
echo 설치 완료. main.py 로 게임을 실행하세요.
pause
