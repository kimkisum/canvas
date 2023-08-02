
function barChart(mychart_id){
    const mychart = document.getElementById(mychart_id);
    mychart.style.display = "flex";

    // 바 차트 뒤에 y축 라벨을 표시하는 캔버스
    let Ycanvas = createObject(mychart, 'canvas')
    Ycanvas.width = 30; // 30px로 설정
    Ycanvas.height = mychart.offsetHeight;
    Ycanvas.style.background = "transparent";

    //캔버스 만들어서 div에 넣기
    let scrollDiv = createObject(mychart, 'div')
    scrollDiv.style.width = mychart.offsetWidth + "px";
    scrollDiv.style.height = mychart.offsetHeight + "px";
    scrollDiv.style.overflow = "hidden"; // 스크롤 기능 활성화

    let canvas = createObject(scrollDiv, 'canvas');
    canvas.width = data.length * 60; // 막대 간 간격 60px로 설정
    canvas.height = mychart.offsetHeight;
    canvas.style.background = "transparent"

    //데이터 전처리
    var maxValue = Math.max(...data) + 10; // Math.max(...data)로 수정하여 최대값 계산
    var barWidth = 40; // 각 막대의 너비를 40px로 설정
    var gap = 20; // 막대 간 간격을 20px로 설정
    var bottomMargin = 70; // 막대 차트 하단 여백을 70px로 설정
    var canvasHeight = canvas.height - bottomMargin;
    var x = gap;
    var yPadding = 30;

    const ctx = canvas.getContext('2d');
    const cty = Ycanvas.getContext('2d');

    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // y축 라벨링
    var yAxisLabelInterval = Math.ceil(maxValue / 5); // y축 라벨링 간격 계산
    cty.fillStyle = '#ffffff';
    cty.font = '14px Arial';
    for (var i = 0; i <= 5; i++) {
        cty.fillStyle = '#000000';
        var yAxisLabel = yAxisLabelInterval * i;
        var yPosition = canvasHeight - (yAxisLabel / maxValue) * canvasHeight + yPadding; // 라벨의 위치 설정
        cty.fillText(yAxisLabel, Ycanvas.width - 25 , yPosition); // y축 라벨링

        // y축 라벨링을 위한 점선 그리기 (가로로 변경)
        if(i == 0){
            ctx.beginPath();
            ctx.moveTo(0, yPosition+1); // 실선 시작점
            ctx.lineTo(canvas.width, yPosition+1); // 점선 끝점
            ctx.stroke();
            
            cty.beginPath();
            cty.moveTo(Ycanvas.width - 1, yPadding - 10); // 실선 시작점
            cty.lineTo(Ycanvas.width - 1, yPosition+2); // 점선 끝점
            cty.stroke();
        }else{
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.setLineDash([2, 2]);
            ctx.moveTo(0, yPosition); // 점선 시작점
            ctx.lineTo(canvas.width, yPosition); // 점선 끝점
            ctx.stroke();
        }
    }
    
    for (var i = 0; i < data.length; i++) {
        var barHeight = (data[i] / maxValue) * canvasHeight;
        var y = canvasHeight - barHeight;
        ctx.fillStyle = colors[i % colors.length]; // colors 배열에서 색상을 선택할 때 인덱스 오버플로우 방지

        ctx.fillRect(x, y+yPadding, barWidth, barHeight);

        ctx.fillStyle = '#000000';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center'; // 텍스트 가운데 정렬

        // x축 라벨링
        ctx.fillText(labels[i], x + barWidth / 2, canvasHeight + 20 + yPadding);

        // 바 위에 바의 값을 표시 (값이 보이도록 위치 조정)
        ctx.fillText(data[i], x + barWidth / 2, y - 10 + yPadding);

        x += barWidth + gap;
    }

    mousescroll(scrollDiv);

}

//Object라고 적긴했지만 엘리먼트임
//매개변수 : 추가할 부모 엘리먼트,만들고 싶은 엘리먼트
//반환 : 만들어진 엘리먼트 객체
function createObject(parent, mode){
    let object = document.createElement(mode);
    parent.appendChild(object);

    return object;
}


//마우스 클릭 스크롤 함수
//매개변수 : 엘리먼트객체
function mousescroll(Object){
    let isDragging = false;
    let dragStartX, scrollStartX;
    // 마우스 다운 이벤트 리스너
    Object.addEventListener("mousedown", function (event) {
        isDragging = true;
        dragStartX = event.clientX;
        scrollStartX = Object.scrollLeft;
    });

    // 마우스 업 이벤트 리스너
    Object.addEventListener("mouseup", function () {
        isDragging = false;
    });

    Object.addEventListener("mouseout", function () {
        isDragging = false;
    });

    // 마우스 무브 이벤트 리스너
    Object.addEventListener("mousemove", function (event) {
        if (isDragging) {
            const deltaX = event.clientX - dragStartX;
            Object.scrollLeft = scrollStartX - deltaX; // 마우스 드래그에 따라 스크롤 기능 적용
        }
    });
}