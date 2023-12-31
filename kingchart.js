let defaultColors = ['#FF6384', '#36A2EB', '#FFCE56', '#00cc99', '#cc00cc'];

//element 엘리먼트임
//매개변수 : 추가할 부모 엘리먼트,만들고 싶은 엘리먼트
//반환 : 만들어진 엘리먼트 객체
function createObject(parent, mode) {
    let element = document.createElement(mode);
    parent.appendChild(element);

    return element;
}

//마우스 클릭 스크롤 함수
//매개변수 : 엘리먼트객체
function mousescroll(element) {
    let isDragging = false;
    let dragStartX, scrollStartX;
    let dragStartY, scrollStartY;
    // 마우스 다운 이벤트 리스너
    element.addEventListener("mousedown", function (event) {
        isDragging = true;
        dragStartX = event.clientX;
        scrollStartX = element.scrollLeft;
        dragStartY = event.clientY;
        scrollStartY = element.scrollTop;
    });

    // 마우스 업 이벤트 리스너
    element.addEventListener("mouseup", function () {
        isDragging = false;
    });

    element.addEventListener("mouseout", function () {
        isDragging = false;
    });

    // 마우스 무브 이벤트 리스너
    element.addEventListener("mousemove", function (event) {
        if (isDragging) {
            const deltaX = event.clientX - dragStartX;
            element.scrollLeft = scrollStartX - deltaX; // 마우스 드래그에 따라 스크롤 기능 적용
            const deltaY = event.clientY - dragStartY;
            element.scrollTop = scrollStartY - deltaY; // 마우스 드래그에 따라 스크롤 기능 적용
        }
    });
    // 마우스 휠 스크롤 이벤트 리스너
    element.addEventListener("wheel", function (event) {
        // Chrome과 Firefox의 마우스 휠 이벤트 값이 다릅니다.
        // Chrome: event.deltaY, Firefox: event.wheelDeltaY
        const scrollDelta = (event.deltaY || event.wheelDeltaY) * -1;
        element.scrollTop -= scrollDelta / 2; // 휠 스크롤 속도 조정
        event.preventDefault(); // 기본 스크롤 동작 방지
    });

}

//바차트
//매개변수 : 객체 이름, 데이터
function barChart(mychart_id, data) {
    const mychart = document.getElementById(mychart_id);
    mychart.style.display = "flex";

    //데이터 전처리
    var maxValue = Math.max(...data.data) + 10; // Math.max(...data.data)로 수정하여 최대값 계산
    var barWidth = 40; // 각 막대의 너비를 40px로 설정
    var gap = 20; // 막대 간 간격을 20px로 설정
    var bottomMargin = 55; // 막대 차트 하단 여백을 70px로 설정
    var x = gap;
    var yPadding = 30;

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
    canvas.width = data.data.length * 60; // 막대 간 간격 60px로 설정
    canvas.height = mychart.offsetHeight - (yPadding - 9);
    canvas.style.background = "transparent"

    var canvasHeight = canvas.height - bottomMargin;

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
        cty.fillText(yAxisLabel, Ycanvas.width - 25, yPosition); // y축 라벨링

        // y축 라벨링을 위한 점선 그리기 (가로로 변경)
        if (i == 0) {
            ctx.beginPath();
            ctx.moveTo(0, yPosition + 1); // 실선 시작점
            ctx.lineTo(canvas.width, yPosition + 1); // 점선 끝점
            ctx.stroke();

            cty.beginPath();
            cty.moveTo(Ycanvas.width - 1, yPadding - 10); // 실선 시작점
            cty.lineTo(Ycanvas.width - 1, yPosition + 2); // 점선 끝점
            cty.stroke();
        } else {
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.setLineDash([2, 2]);
            ctx.moveTo(0, yPosition); // 점선 시작점
            ctx.lineTo(canvas.width, yPosition); // 점선 끝점
            ctx.stroke();
        }
    }

    for (var i = 0; i < data.data.length; i++) {
        var barHeight = (data.data[i] / maxValue) * canvasHeight;
        var y = canvasHeight - barHeight;
        ctx.fillStyle = data.colors[i % data.colors.length]; // colors 배열에서 색상을 선택할 때 인덱스 오버플로우 방지

        ctx.fillRect(x, y + yPadding, barWidth, barHeight);

        ctx.fillStyle = '#000000';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center'; // 텍스트 가운데 정렬

        // x축 라벨링
        ctx.fillText(data.labels[i], x + barWidth / 2, canvasHeight + 20 + yPadding);

        // 바 위에 바의 값을 표시 (값이 보이도록 위치 조정)
        ctx.fillText(data.data[i], x + barWidth / 2, y - 5 + yPadding);

        x += barWidth + gap;
    }

    mousescroll(scrollDiv);

}

//그래프차트
//매개변수 : 객체 이름, 데이터
function graphChart(mychart_id, data) {
    const mychart = document.getElementById(mychart_id);
    mychart.style.display = "flex";

    //데이터 전처리
    var maxValue = Math.max(...data.data) + 10; // Math.max(...data.data)로 수정하여 최대값 계산
    var gap = 60; // 간격을 20px로 설정
    var bottomMargin = 55; // 차트 하단 여백을 55px로 설정
    var x = 30;
    var yPadding = 30;

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
    canvas.width = data.data.length * 60; // 막대 간 간격 60px로 설정
    canvas.height = mychart.offsetHeight - (yPadding - 9);
    canvas.style.background = "transparent"

    var canvasHeight = canvas.height - bottomMargin;

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
        cty.fillText(yAxisLabel, Ycanvas.width - 25, yPosition); // y축 라벨링

        // y축 라벨링을 위한 점선 그리기 (가로로 변경)
        if (i == 0) {
            ctx.beginPath();
            ctx.moveTo(0, yPosition + 1); // 실선 시작점
            ctx.lineTo(canvas.width, yPosition + 1); // 점선 끝점
            ctx.stroke();

            cty.beginPath();
            cty.moveTo(Ycanvas.width - 1, yPadding - 10); // 실선 시작점
            cty.lineTo(Ycanvas.width - 1, yPosition + 2); // 점선 끝점
            cty.stroke();
        } else {
            ctx.strokeStyle = '#cccccc';
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.setLineDash([2, 2]);
            ctx.moveTo(0, yPosition); // 점선 시작점
            ctx.lineTo(canvas.width, yPosition); // 점선 끝점
            ctx.stroke();
        }
    }

    ctx.setLineDash([0, 0]);
    ctx.beginPath();
    ctx.strokeStyle = 'blue';

    for (var i = 0; i < data.data.length; i++) {
        var y = canvasHeight - (data.data[i] / maxValue) * canvasHeight;


        if (i == 0) {
            ctx.moveTo(x, y + yPadding);
        } else {
            ctx.lineTo(x, y + yPadding);
        }
        ctx.stroke();


        x += gap;
    }

    x = 30

    ctx.strokeStyle = '#000000';
    for (var i = 0; i < data.data.length; i++) {
        var y = canvasHeight - (data.data[i] / maxValue) * canvasHeight;

        ctx.fillStyle = '#000000';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center'; // 텍스트 가운데 정렬

        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.moveTo(x, canvasHeight + 30); // 점선 시작점
        ctx.lineTo(x, y + 30); // 점선 끝점
        ctx.stroke();
        // x축 라벨링
        ctx.fillText(data.labels[i], x, canvasHeight + 20 + yPadding);

        // 바 위에 바의 값을 표시 (값이 보이도록 위치 조정)
        ctx.fillText(data.data[i], x + 40 / 2, y - 5 + yPadding);

        x += gap;
    }

    mousescroll(scrollDiv);

}

//스택라인 차트
//매개변수 : 객체 이름, 데이터
function stackedLineChart(mychart_id, data) {
    const mychart = document.getElementById(mychart_id);
    while(mychart.firstChild) {mychart.removeChild(mychart.firstChild);}
    mychart.style.display = "flex";

    // 데이터 전처리
    var maxValue = 0; // Math.max(...data.data)로 수정하여 최대값 계산
    for (i = 0; i < data.data.length; i++) {
        let tempmax = Math.max(...data.data[i].data) + 10;
        maxValue = maxValue < tempmax ? tempmax : maxValue;
    }
    var gap = 60; // 간격을 60px로 설정
    var bottomMargin = 55; // 차트 하단 여백을 55px로 설정
    var defaultX = 0;
    var x = defaultX;
    var yPadding = 30;

    // 바 차트 뒤에 y축 라벨을 표시하는 캔버스
    let Ycanvas = createObject(mychart, 'canvas')
    Ycanvas.width = 60; // 30px로 설정
    Ycanvas.height = mychart.offsetHeight;
    Ycanvas.style.background = "transparent";

    // 툴팁을 생성하기 위한 div 요소
    let tooltip = createObject(mychart, 'div');
    tooltip.style.position = 'absolute';
    tooltip.style.display = 'none';
    tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    tooltip.style.color = '#ffffff';
    tooltip.style.padding = '5px';
    tooltip.style.fontFamily = 'Arial';
    tooltip.style.fontSize = '12px';

    // 캔버스 만들어서 div에 넣기
    let scrollDiv = createObject(mychart, 'div')
    scrollDiv.style.width = mychart.offsetWidth + "px";
    scrollDiv.style.height = mychart.offsetHeight + "px";
    scrollDiv.style.overflow = "hidden"; // 스크롤 기능 활성화

    let canvas = createObject(scrollDiv, 'canvas');
    canvas.width = data.data[0].data.length * 60; // 막대 간 간격 60px로 설정
    canvas.height = mychart.offsetHeight - (yPadding - 9);
    canvas.style.background = "transparent";

    var canvasHeight = canvas.height - bottomMargin;

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
        cty.fillText(yAxisLabel, Ycanvas.width - 50, yPosition); // y축 라벨링

        // y축 라벨링을 위한 점선 그리기 (가로로 변경)
        if (i == 0) {
            ctx.beginPath();
            ctx.moveTo(0, yPosition + 1); // 실선 시작점
            ctx.lineTo(canvas.width, yPosition + 1); // 점선 끝점
            ctx.stroke();

            cty.beginPath();
            cty.moveTo(Ycanvas.width - 1, yPadding - 10); // 실선 시작점
            cty.lineTo(Ycanvas.width - 1, yPosition + 2); // 점선 끝점
            cty.stroke();
        } else {
            ctx.strokeStyle = '#cccccc';
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.setLineDash([2, 2]);
            ctx.moveTo(0, yPosition); // 점선 시작점
            ctx.lineTo(canvas.width, yPosition); // 점선 끝점
            ctx.stroke();
        }
    }

    ctx.setLineDash([0, 0]);

    for (let a = 0; a < data.data.length; a++) {
        console.log(a)

        ctx.beginPath();
        ctx.strokeStyle = defaultColors[a % defaultColors.length];
        x = defaultX;

        for (var i = 0; i < data.data[a].data.length; i++) {
            var y = canvasHeight - (data.data[a].data[i] / maxValue) * canvasHeight;

            if (i == 0) {
                ctx.moveTo(x, y + yPadding);
            } else {
                ctx.lineTo(x, y + yPadding);
            }
            ctx.stroke();

            x += gap;
        }

        x = defaultX

        for (var i = 0; i < data.data[a].data.length; i++) {
            var y = canvasHeight - (data.data[a].data[i] / maxValue) * canvasHeight;

            ctx.fillStyle = defaultColors[a % defaultColors.length];
            ctx.font = '14px Arial';
            ctx.textAlign = 'center'; // 텍스트 가운데 정렬

            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.setLineDash([2, 2]);
            ctx.moveTo(x, canvasHeight + 30); // 점선 시작점
            ctx.lineTo(x, y + 30); // 점선 끝점
            ctx.stroke();

            // x축 라벨링
            if (a == 0) {
                ctx.fillText(data.labels[i % data.labels.length], x, canvasHeight + 20 + yPadding);
            }
            // 바 위에 바의 값을 표시 (값이 보이도록 위치 조정)
            ctx.fillText(data.data[a].data[i], x + 40 / 2, y - 5 + yPadding);

            x += gap;
        }
    }

    // 캔버스에 마우스 이벤트 리스너 추가
    canvas.addEventListener('mousemove', function (event) {
        
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        // 마우스 위치를 바탕으로 해당 데이터 포인트의 인덱스 계산
        const dataPointIndex = Math.round((mouseX - defaultX) / gap);


        // 툴팁에 표시할 데이터 준비
        let tooltipData = '';
        for (let a = 0; a < data.data.length; a++) {
            tooltipData += data.data[a].name + ': ' + data.data[a].data[dataPointIndex] + '\n';
        }

        // 툴팁을 마우스 위치에 따라 보여줌
        tooltip.style.left = event.pageX + 10 + 'px';
        tooltip.style.top = event.pageY + 10 + 'px';
        tooltip.innerText = tooltipData;
        tooltip.style.display = 'block';
    });

    // 마우스가 캔버스를 벗어나면 툴팁을 숨김
    canvas.addEventListener('mouseout', function () {
        tooltip.style.display = 'none';
    });

    mousescroll(scrollDiv)
}

//파이차트
//매개변수 : 객체 이름, 데이터
function pieChart(mychart_id, data){
    const mychart = document.getElementById(mychart_id);
    const canvas = createObject(mychart, 'canvas');

    canvas.height = mychart.offsetHeight;
    canvas.width = mychart.offsetWidth;

    const ctx = canvas.getContext('2d');
    const total = data.data.reduce((acc, value) => acc + value, 0);

    const padding = 20;
    let startAngle = 0;

    const drawCanvasWidth = canvas.width - (padding * 10);
    const drawCanvasHeight = canvas.width - (padding * 10);

    for (let i = 0; i < data.data.length; i++) {
      const sliceAngle = (2 * Math.PI * data.data[i]) / total;
      ctx.beginPath();
      
      ctx.fillStyle = data.colors[i % data.colors.length];
      ctx.moveTo(drawCanvasWidth / 2, drawCanvasHeight / 2);
      ctx.arc(
        (drawCanvasWidth + padding) / 2,
        (drawCanvasHeight + padding) / 2,
        Math.min(drawCanvasWidth - (padding * 4) , drawCanvasHeight - ( padding * 4 )) / 2,
        startAngle,
        startAngle + sliceAngle
      );
      ctx.closePath();
      ctx.fill();

      // 라벨 출력
      ctx.font = '14px Arial';
      ctx.fillStyle = '#000';
      const labelX = ((drawCanvasWidth) + 10)/ 2 + Math.cos(startAngle + sliceAngle / 2) * 170;
      const labelY = ((drawCanvasHeight) + 30) / 2 + Math.sin(startAngle + sliceAngle / 2) * 170;
      ctx.fillText(data.labels[i], labelX, labelY);

      startAngle += sliceAngle;
    }
}