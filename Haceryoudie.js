/*!
 * Simple PullToRefreshJS
 * (c) Rafael Soto
 * Released under the MIT License.
 */
(function () {
    "use strict";

    var options = {
        pullStartY: null,
        pullMoveY: null,
        handlers: [],
        dist: 0,
        state: "pending",
        timeout: null,
        distResisted: 0,
        supportsPassive: false,
        distThreshold: 60,
        distMax: 80,
        distReload: 50,
        refreshTimeout: 500,
        onInit: function () { },
        onRefresh: function () { location.reload(); },
        resistanceFunction: function (t) { return Math.min(1, t / 2.5); },
        shouldPullToRefresh: function () { return !window.scrollY; }
    };

    try {
        window.addEventListener("test", null, {
            get passive() {
                options.supportsPassive = true;
            }
        });
    } catch (e) { }

    function setupDOM() {
        var container = document.createElement("div");
        document.body.insertBefore(container, document.body.firstChild);
        container.className = "ptr";
        container.innerHTML = `
            <div class="box">
                <div class="content">
                    <div class="icon">&#8675;</div>
                    <div class="text">Pull down to refresh</div>
                </div>
            </div>
        `;
        return container;
    }

    function update(container, state) {
        var icon = container.querySelector(".icon");
        var text = container.querySelector(".text");

        if (state === "refreshing") {
            icon.innerHTML = "&hellip;";
            text.innerHTML = "Refreshing";
        } else if (state === "releasing") {
            text.innerHTML = "Release to refresh";
        } else {
            icon.innerHTML = "&#8675;";
            text.innerHTML = "Pull down to refresh";
        }
    }

    function onTouchStart(e) {
        if (options.shouldPullToRefresh()) {
            options.pullStartY = e.touches[0].screenY;
        }
    }

    function onTouchMove(e) {
        if (!options.pullStartY) {
            return;
        }

        options.pullMoveY = e.touches[0].screenY;
        options.dist = options.pullMoveY - options.pullStartY;

        if (options.dist > 0) {
            e.preventDefault();
            options.distResisted = options.resistanceFunction(options.dist / options.distThreshold) * Math.min(options.distMax, options.dist);
            container.style.minHeight = options.distResisted + "px";

            if (options.distResisted > options.distThreshold && options.state !== "releasing") {
                options.state = "releasing";
                update(container, options.state);
            } else if (options.distResisted <= options.distThreshold && options.state !== "pulling") {
                options.state = "pulling";
                update(container, options.state);
            }
        }
    }

    function onTouchEnd() {
        if (!options.pullStartY) {
            return;
        }

        if (options.state === "releasing" && options.distResisted > options.distThreshold) {
            options.state = "refreshing";
            container.style.minHeight = options.distReload + "px";
            update(container, options.state);

            options.timeout = setTimeout(function () {
                var result = options.onRefresh(function () {
                    reset();
                });
                if (result && typeof result.then === "function") {
                    result.then(function () {
                        reset();
                    });
                } else {
                    reset();
                }
            }, options.refreshTimeout);
        } else {
            reset();
        }
    }

    function reset() {
        container.style.minHeight = "0px";
        options.state = "pending";
        options.pullStartY = options.pullMoveY = null;
        options.dist = options.distResisted = 0;
        update(container, options.state);
    }

    var container = setupDOM();
    update(container, options.state);

    window.addEventListener("touchstart", onTouchStart, options.supportsPassive ? { passive: true } : false);
    window.addEventListener("touchmove", onTouchMove, options.supportsPassive ? { passive: false } : false);
    window.addEventListener("touchend", onTouchEnd);

    options.onInit();
})();
