class BrakeBanner {
  constructor(selector) {
    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0xffffff,
      resizeTo: window,
    });
    document.querySelector(selector).appendChild(this.app.view);
    this.loader = new PIXI.Loader();
    this.loader.add("btn.png", "images/btn.png");
    this.loader.add("brake_bike.png", "images/brake_bike.png");
    this.loader.add("brake_handlerbar.png", "images/brake_handlerbar.png");
    this.loader.add("brake_lever.png", "images/brake_lever.png");
    this.loader.add("btn_circle.png", "images/btn_circle.png");
    this.loader.load();

    this.loader.onComplete.add(() => {
      this.show();
    });
  }
  show() {
    const actionButton = this.createActionButton();
    actionButton.x = actionButton.y = window.innerWidth / 2;

    const bikeContainer = new PIXI.Container();
    this.app.stage.addChild(bikeContainer);

    bikeContainer.scale.x = bikeContainer.scale.y = 0.5;

    const bikeSprite = new PIXI.Sprite(
      this.loader.resources["brake_bike.png"].texture
    );
    const brakeLeverSprite = new PIXI.Sprite(
      this.loader.resources["brake_lever.png"].texture
    );
    const brakeHandlerbarSprite = new PIXI.Sprite(
      this.loader.resources["brake_handlerbar.png"].texture
    );

    brakeLeverSprite.pivot.x = 455;
    brakeLeverSprite.pivot.y = 455;
    brakeLeverSprite.x = 722;
    brakeLeverSprite.y = 900;
    bikeContainer.addChild(bikeSprite);
    bikeContainer.addChild(brakeLeverSprite);
    bikeContainer.addChild(brakeHandlerbarSprite);

    actionButton.interactive = true;
    actionButton.buttonMode = true;
    const { particleContainer, start, pause } = this.createParticleContainer();

    actionButton.on("mousedown", () => {
      pause();
      gsap.to(brakeLeverSprite, {
        duration: 0.6,
        rotation: (Math.PI / 180) * -30,
      });
    });
    actionButton.on("mouseup", () => {
      start();
      gsap.to(brakeLeverSprite, {
        duration: 0.6,
        rotation: 0,
      });
    });
    const resize = () => {
      bikeContainer.x = window.innerWidth - bikeContainer.width;
      bikeContainer.y = window.innerHeight - bikeContainer.height;
    };

    window.addEventListener("resize", resize);
    resize();
    this.app.stage.addChild(actionButton);

    // this.app.stage.addChild(particleContainer);
  }

  createActionButton() {
    const container = new PIXI.Container();

    const btnSprite = new PIXI.Sprite(this.loader.resources["btn.png"].texture);
    const btnCircleSprite = new PIXI.Sprite(
      this.loader.resources["btn_circle.png"].texture
    );
    const btnCircleSprite2 = new PIXI.Sprite(
      this.loader.resources["btn_circle.png"].texture
    );
    btnSprite.pivot.x = btnSprite.pivot.y = btnSprite.width / 2;
    btnCircleSprite.pivot.x = btnCircleSprite.pivot.y =
      btnCircleSprite.width / 2;
    btnCircleSprite2.pivot.x = btnCircleSprite2.pivot.y =
      btnCircleSprite2.width / 2;

    container.addChild(btnSprite);
    container.addChild(btnCircleSprite);
    container.addChild(btnCircleSprite2);

    btnCircleSprite.scale.x = btnCircleSprite.scale.y = 0.7;
    gsap.to(btnCircleSprite.scale, {
      duration: 1,
      x: 1.3,
      y: 1.3,
      repeat: -1,
    });
    gsap.to(btnCircleSprite, {
      duration: 1,
      alpha: 0,
      repeat: -1,
    });

    return container;
  }
  // 创建粒子
  // 粒子有多个颜色
  // 向某一个角持续移动
  // 超出边界后回到顶部继续移动
  // 按住鼠标停止
  // 停止的时候还有一点回弹的效果
  // 松开鼠标继续
  createParticleContainer() {
    const particleContainer = new PIXI.Container();
    particleContainer.pivot.x = window.innerWidth / 2;
    particleContainer.pivot.y = window.innerHeight / 2;

    particleContainer.x = window.innerWidth / 2;
    particleContainer.y = window.innerHeight / 2;

    particleContainer.rotation = (35 * Math.PI) / 180;
    const particles = [];
    const colors = [0xf1cf54, 0xb5cea8, 0xf1cf54, 0x818181, 0x000000];
    let speed = 0;
    for (let index = 0; index < 20; index++) {
      const gr = new PIXI.Graphics();
      const i = Math.floor(Math.random() * colors.length);
      gr.beginFill(colors[i]);
      gr.drawCircle(0, 0, 3);
      gr.endFill();
      gr.x = Math.random() * window.innerWidth;
      gr.y = Math.random() * window.innerHeight;

      const pItem = {
        sx: Math.random() * window.innerWidth,
        sy: Math.random() * window.innerHeight,
        gr,
      };

      particles.push(pItem);
      particleContainer.addChild(gr);
    }

    const loop = () => {
      speed += 0.5;
      speed = Math.min(speed, 20);
      for (let index = 0; index < particles.length; index++) {
        const pItem = particles[index];
        pItem.gr.y += speed;

        if (speed === 20) {
          pItem.gr.scale.x = 0.1;
          pItem.gr.scale.y = 30;
        }
        if (pItem.gr.y > window.innerHeight) {
          pItem.gr.y = 0;
        }
      }
    };
    gsap.ticker.add(loop);
    function start() {
      speed = 0;
      gsap.ticker.add(loop);
    }

    function pause() {
      gsap.ticker.remove(loop);
      for (let index = 0; index < particles.length; index++) {
        const pItem = particles[index];
        pItem.gr.y += speed;
        pItem.gr.scale.x = 1;
        pItem.gr.scale.y = 1;

        gsap.to(pItem.gr, {
          duration: 0.6,
          x: pItem.sx,
          y: pItem.sy,
          ease: "elastic.out",
        });
      }
    }

    return {
      particleContainer,
      start,
      pause,
    };
  }
}
